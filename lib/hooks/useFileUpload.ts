import { useState, useCallback, useRef } from 'react'
import { UploadService } from '../uploadService'
import { Upload } from '../types'

interface UseFileUploadResult {
  uploadedFiles: Upload[]
  dragActive: boolean
  handleFiles: (files: FileList | null) => void
  handleDrag: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  clearUploadedFiles: () => void
}

export function useFileUpload(activeTab: string, onUploadComplete?: () => void): UseFileUploadResult {
  const [uploadedFiles, setUploadedFiles] = useState<Upload[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (activeTab === 'archive') return // Don't allow uploads on archive tab

    const newUploads: Upload[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type based on active tab
      const isValidType = (() => {
        const fileType = file.type.toLowerCase()
        const fileName = file.name.toLowerCase()
        
        switch (activeTab) {
          case 'catalog':
            return fileType.includes('csv') || 
                   fileType.includes('excel') || 
                   fileType.includes('spreadsheet') ||
                   fileName.endsWith('.csv') ||
                   fileName.endsWith('.xlsx') ||
                   fileName.endsWith('.xls')
          case 'royalties':
            return fileType.includes('csv') || 
                   fileType.includes('excel') || 
                   fileType.includes('spreadsheet') ||
                   fileType.includes('pdf') ||
                   fileName.endsWith('.csv') ||
                   fileName.endsWith('.xlsx') ||
                   fileName.endsWith('.xls') ||
                   fileName.endsWith('.pdf')
          case 'agreements':
            return fileType.includes('pdf') ||
                   fileType.includes('document') ||
                   fileType.includes('text') ||
                   fileName.endsWith('.pdf') ||
                   fileName.endsWith('.doc') ||
                   fileName.endsWith('.docx') ||
                   fileName.endsWith('.txt')
          default:
            return false
        }
      })()

      if (!isValidType) {
        console.warn(`File ${file.name} is not a valid type for ${activeTab} tab`)
        continue
      }

      // Create upload record
      const uploadRecord: Upload = {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        tab_category: activeTab as 'catalog' | 'royalties' | 'agreements',
        status: 'uploading',
        metadata: {
          original_name: file.name,
          progress: 0,
          upload_timestamp: new Date().toISOString()
        }
      }

      newUploads.push(uploadRecord)
      setUploadedFiles(prev => [...prev, uploadRecord])

      // Start upload
      try {
        const result = await UploadService.uploadFile(
          file, 
          activeTab as 'catalog' | 'royalties' | 'agreements',
          (progress) => {
            setUploadedFiles(prev => 
              prev.map(f => 
                f.file_name === file.name && f.file_size === file.size
                  ? { ...f, metadata: { ...f.metadata, progress } }
                  : f
              )
            )
          }
        )

        // Update upload record with result
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file_name === file.name && f.file_size === file.size
              ? { ...result, metadata: { ...f.metadata, progress: 100 } }
              : f
          )
        )

        onUploadComplete?.()
      } catch (error) {
        console.error('Upload failed:', error)
        setUploadedFiles(prev => 
          prev.map(f => 
            f.file_name === file.name && f.file_size === file.size
              ? { 
                  ...f, 
                  status: 'error', 
                  error_message: error instanceof Error ? error.message : 'Upload failed'
                }
              : f
          )
        )
      }
    }
  }, [activeTab, onUploadComplete])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([])
  }, [])

  return {
    uploadedFiles,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    fileInputRef,
    clearUploadedFiles
  }
}