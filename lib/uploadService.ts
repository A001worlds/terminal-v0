import { supabase } from './supabaseClient'
import { Upload } from './types'

export class UploadService {
  /**
   * Upload a file to Supabase storage and create database record
   */
  static async uploadFile(
    file: File, 
    tabCategory: 'catalog' | 'royalties' | 'agreements',
    onProgress?: (progress: number) => void
  ): Promise<Upload> {
    try {
      // Create initial database record
      const uploadRecord: Partial<Upload> = {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        tab_category: tabCategory,
        status: 'uploading',
        metadata: {
          original_name: file.name,
          upload_timestamp: new Date().toISOString()
        }
      }

      const { data: dbRecord, error: dbError } = await supabase
        .from('uploads')
        .insert(uploadRecord)
        .select()
        .single()

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      // Generate unique file path
      const fileExtension = file.name.split('.').pop()
      const storagePath = `${tabCategory}/${dbRecord.id}.${fileExtension}`

      // Upload to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('uploads')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (storageError) {
        // Update record with error
        await supabase
          .from('uploads')
          .update({ 
            status: 'error', 
            error_message: `Storage error: ${storageError.message}` 
          })
          .eq('id', dbRecord.id)
        
        throw new Error(`Storage error: ${storageError.message}`)
      }

      // Update database record with storage path
      const { data: updatedRecord, error: updateError } = await supabase
        .from('uploads')
        .update({ 
          storage_path: storagePath,
          status: 'processing'
        })
        .eq('id', dbRecord.id)
        .select()
        .single()

      if (updateError) {
        throw new Error(`Update error: ${updateError.message}`)
      }

      // Simulate processing completion (in real app this would be actual processing)
      setTimeout(async () => {
        await supabase
          .from('uploads')
          .update({ 
            status: 'complete',
            processed_at: new Date().toISOString()
          })
          .eq('id', dbRecord.id)
      }, 2000)

      return updatedRecord

    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  /**
   * Get uploads for a specific tab category
   */
  static async getUploads(tabCategory?: string): Promise<Upload[]> {
    let query = supabase
      .from('uploads')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (tabCategory) {
      query = query.eq('tab_category', tabCategory)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch uploads: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get uploads with advanced filtering and sorting
   */
  static async getUploadsWithFilter(options: {
    tabCategory?: string;
    status?: Upload['status'];
    sortBy?: 'uploaded_at' | 'file_name' | 'file_size' | 'processed_at';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    search?: string;
    includeArchived?: boolean;
  } = {}): Promise<Upload[]> {
    const {
      tabCategory,
      status,
      sortBy = 'uploaded_at',
      sortOrder = 'desc',
      limit,
      search,
      includeArchived = false
    } = options;

    let query = supabase
      .from('uploads')
      .select('*')

    // Apply filters
    if (tabCategory) {
      query = query.eq('tab_category', tabCategory)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`file_name.ilike.%${search}%,metadata->>original_name.ilike.%${search}%`)
    }

    // Filter archived status
    if (!includeArchived) {
      query = query.or('archived.is.null,archived.eq.false')
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply limit
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch filtered uploads: ${error.message}`)
    }

    return data || []
  }

  /**
   * Bulk delete uploads
   */
  static async bulkDeleteUploads(ids: string[]): Promise<void> {
    if (ids.length === 0) return

    // Get all upload records with storage paths
    const { data: uploads, error: fetchError } = await supabase
      .from('uploads')
      .select('id, storage_path')
      .in('id', ids)

    if (fetchError) {
      throw new Error(`Failed to fetch uploads for deletion: ${fetchError.message}`)
    }

    // Delete from storage (if paths exist)
    const storagePaths = uploads?.filter(u => u.storage_path).map(u => u.storage_path) || []
    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove(storagePaths)

      if (storageError) {
        console.warn('Some files failed to delete from storage:', storageError.message)
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('uploads')
      .delete()
      .in('id', ids)

    if (dbError) {
      throw new Error(`Failed to bulk delete uploads: ${dbError.message}`)
    }
  }

  /**
   * Update upload status
   */
  static async updateUploadStatus(
    id: string, 
    status: Upload['status'], 
    errorMessage?: string
  ): Promise<void> {
    const updateData: Partial<Upload> = { status }
    
    if (errorMessage) {
      updateData.error_message = errorMessage
    }
    
    if (status === 'complete') {
      updateData.processed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('uploads')
      .update(updateData)
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to update upload: ${error.message}`)
    }
  }

  /**
   * Archive an upload (soft delete)
   */
  static async archiveUpload(id: string): Promise<void> {
    const { error } = await supabase
      .from('uploads')
      .update({ 
        archived: true,
        archived_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to archive upload: ${error.message}`)
    }
  }

  /**
   * Unarchive an upload
   */
  static async unarchiveUpload(id: string): Promise<void> {
    const { error } = await supabase
      .from('uploads')
      .update({ 
        archived: false,
        archived_at: null
      })
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to unarchive upload: ${error.message}`)
    }
  }

  /**
   * Bulk archive uploads
   */
  static async bulkArchiveUploads(ids: string[]): Promise<void> {
    if (ids.length === 0) return

    const { error } = await supabase
      .from('uploads')
      .update({ 
        archived: true,
        archived_at: new Date().toISOString()
      })
      .in('id', ids)

    if (error) {
      throw new Error(`Failed to bulk archive uploads: ${error.message}`)
    }
  }

  /**
   * Delete an upload (both database record and storage file)
   */
  static async deleteUpload(id: string): Promise<void> {
    // Get upload record first
    const { data: upload, error: fetchError } = await supabase
      .from('uploads')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch upload: ${fetchError.message}`)
    }

    // Delete from storage if path exists
    if (upload?.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([upload.storage_path])

      if (storageError) {
        console.warn('Failed to delete from storage:', storageError.message)
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('uploads')
      .delete()
      .eq('id', id)

    if (dbError) {
      throw new Error(`Failed to delete upload: ${dbError.message}`)
    }
  }

  /**
   * Get upload statistics by tab category
   */
  static async getUploadStats(): Promise<Record<string, { count: number; lastUpload?: string }>> {
    const { data, error } = await supabase
      .from('uploads')
      .select('tab_category, uploaded_at, status')
      .eq('status', 'complete')

    if (error) {
      throw new Error(`Failed to fetch stats: ${error.message}`)
    }

    const stats = {
      catalog: { count: 0, lastUpload: undefined as string | undefined },
      royalties: { count: 0, lastUpload: undefined as string | undefined },
      agreements: { count: 0, lastUpload: undefined as string | undefined }
    }

    data?.forEach(upload => {
      const category = upload.tab_category as keyof typeof stats
      if (stats[category]) {
        stats[category].count++
        
        if (!stats[category].lastUpload || 
            upload.uploaded_at > stats[category].lastUpload!) {
          stats[category].lastUpload = upload.uploaded_at
        }
      }
    })

    return stats
  }
}