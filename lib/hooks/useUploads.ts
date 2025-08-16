import { useState, useEffect, useCallback } from 'react'
import { UploadService } from '../uploadService'
import { Upload } from '../types'

interface UseUploadsResult {
  uploads: Upload[]
  loading: boolean
  error: string | null
  refreshUploads: () => Promise<void>
  archiveUpload: (id: string) => Promise<void>
  unarchiveUpload: (id: string) => Promise<void>
  deleteUpload: (id: string) => Promise<void>
  bulkDeleteUploads: (ids: string[]) => Promise<void>
  bulkArchiveUploads: (ids: string[]) => Promise<void>
}

export function useUploads(activeTab: string): UseUploadsResult {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshUploads = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (activeTab === 'archive') {
        const allUploads = await UploadService.getUploadsWithFilter({
          includeArchived: true
        })
        const archivedUploads = allUploads.filter(upload => upload.archived === true)
        setUploads(archivedUploads)
      } else {
        const tabUploads = await UploadService.getUploadsWithFilter({
          tabCategory: activeTab,
          includeArchived: false
        })
        setUploads(tabUploads)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load uploads')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  const archiveUpload = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await UploadService.archiveUpload(id)
      await refreshUploads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive upload')
    } finally {
      setLoading(false)
    }
  }, [refreshUploads])

  const unarchiveUpload = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await UploadService.unarchiveUpload(id)
      await refreshUploads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unarchive upload')
    } finally {
      setLoading(false)
    }
  }, [refreshUploads])

  const deleteUpload = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await UploadService.deleteUpload(id)
      await refreshUploads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete upload')
    } finally {
      setLoading(false)
    }
  }, [refreshUploads])

  const bulkDeleteUploads = useCallback(async (ids: string[]) => {
    try {
      setLoading(true)
      await UploadService.bulkDeleteUploads(ids)
      await refreshUploads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete uploads')
    } finally {
      setLoading(false)
    }
  }, [refreshUploads])

  const bulkArchiveUploads = useCallback(async (ids: string[]) => {
    try {
      setLoading(true)
      await UploadService.bulkArchiveUploads(ids)
      await refreshUploads()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive uploads')
    } finally {
      setLoading(false)
    }
  }, [refreshUploads])

  useEffect(() => {
    refreshUploads()
  }, [refreshUploads])

  return {
    uploads,
    loading,
    error,
    refreshUploads,
    archiveUpload,
    unarchiveUpload,
    deleteUpload,
    bulkDeleteUploads,
    bulkArchiveUploads
  }
}