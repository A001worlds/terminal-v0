import React from 'react'
import { 
  File, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Loader, 
  Archive, 
  ArchiveRestore,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react'
import { Upload, Colors } from '../../../lib/types'
import { getFileTypeColor, getStatusColor } from '../../../lib/utils/colors'

interface DocumentListProps {
  uploads: Upload[]
  uploadedFiles: Upload[]
  loading: boolean
  activeTab: string
  selectedFiles: Set<string>
  archiveEnabled: boolean
  colors: Colors
  onToggleSelection: (id: string) => void
  onSelectAll: () => void
  onArchiveFile: (id: string) => void
  onUnarchiveFile: (id: string) => void
  onDeleteFile: (id: string) => void
}

const getFileIcon = (fileType: string, colors: Colors) => {
  const color = getFileTypeColor(fileType, colors)
  
  if (fileType?.includes('pdf')) {
    return <File className="w-4 h-4" style={{ color }} />
  } else if (fileType?.includes('csv') || fileType?.includes('excel') || fileType?.includes('spreadsheet')) {
    return <FileSpreadsheet className="w-4 h-4" style={{ color }} />
  } else {
    return <FileText className="w-4 h-4" style={{ color: colors.fgMuted }} />
  }
}

const getStatusIcon = (upload: Upload, colors: Colors) => {
  switch (upload.status) {
    case 'uploading':
    case 'processing':
      return <Loader className="w-4 h-4 animate-spin" style={{ color: getStatusColor(upload.status, colors) }} />
    case 'complete':
      if (upload.archived) {
        return <Archive className="w-4 h-4" style={{ color: colors.attentionEmphasis }} />
      }
      return <CheckCircle className="w-4 h-4" style={{ color: colors.successEmphasis }} />
    case 'error':
      return <XCircle className="w-4 h-4" style={{ color: colors.dangerEmphasis }} />
    default:
      return null
  }
}

export default function DocumentList({
  uploads,
  uploadedFiles,
  loading,
  activeTab,
  selectedFiles,
  archiveEnabled,
  colors,
  onToggleSelection,
  onSelectAll,
  onArchiveFile,
  onUnarchiveFile,
  onDeleteFile
}: DocumentListProps) {
  const allFiles = [...(uploadedFiles || []).slice(-3), ...(uploads || []).slice(0, 5)]
    .sort((a, b) => new Date(b.uploaded_at || 0).getTime() - new Date(a.uploaded_at || 0).getTime())
    .slice(0, 5)

  if (allFiles.length === 0 && !loading) {
    return null
  }

  return (
    <div 
      className="p-4 rounded-md mb-6"
      style={{ 
        backgroundColor: colors.canvasDefault,
        border: `1px solid ${colors.borderDefault}`
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold" style={{ color: colors.fgDefault }}>
          {activeTab === 'archive' ? 'Archived Documents' : 'Document Library'}
        </h4>
        {uploads.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onSelectAll}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{ 
                backgroundColor: colors.btnBg,
                color: colors.fgDefault,
                border: `1px solid ${colors.btnBorder}`
              }}
            >
              Select All
            </button>
            <span className="text-xs" style={{ color: colors.fgMuted }}>
              {uploads.length} documents
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="flex items-center space-x-2 text-sm" style={{ color: colors.fgMuted }}>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Loading uploads...</span>
          </div>
        )}
        
        {allFiles.map((file, index) => (
          <div 
            key={file.id || `upload-file-${index}-${file.file_name || 'unknown'}-${file.file_size || 0}`} 
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 flex-1">
              {getFileIcon(file.file_type, colors)}
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: colors.fgDefault }}>
                  {file.file_name}
                </p>
                <p className="text-xs" style={{ color: colors.fgMuted }}>
                  {(file.file_size / 1024).toFixed(1)} KB • {file.tab_category}
                </p>
                {file.status === 'uploading' && file.metadata?.progress !== undefined && (
                  <div className="mt-1">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="flex-1 h-1 rounded-full"
                        style={{ backgroundColor: colors.btnBg }}
                      >
                        <div 
                          className="h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${file.metadata.progress}%`,
                            backgroundColor: colors.accentEmphasis
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: colors.fgMuted }}>
                        {Math.round(file.metadata.progress)}%
                      </span>
                    </div>
                  </div>
                )}
                {file.error_message && (
                  <p className="text-xs mt-1" style={{ color: colors.dangerEmphasis }}>
                    {file.error_message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Selection checkbox */}
              {file.id && (
                <button
                  onClick={() => onToggleSelection(file.id!)}
                  className="p-1 rounded transition-colors"
                  style={{ color: colors.fgMuted }}
                >
                  {selectedFiles.has(file.id) ? (
                    <CheckSquare className="w-4 h-4" style={{ color: colors.accentEmphasis }} />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              )}
              
              {/* Status icon */}
              {getStatusIcon(file, colors)}
              
              {/* Archive/Unarchive button */}
              {archiveEnabled && file.id && file.status === 'complete' && (
                <>
                  {file.archived ? (
                    <button
                      onClick={() => onUnarchiveFile(file.id!)}
                      className="p-1 rounded transition-colors"
                      style={{ color: colors.attentionEmphasis }}
                      title="Unarchive document"
                    >
                      <ArchiveRestore className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onArchiveFile(file.id!)}
                      className="p-1 rounded transition-colors"
                      style={{ color: colors.attentionEmphasis }}
                      title="Archive document"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
              
              {/* Delete button */}
              {file.id && file.status === 'complete' && (
                <button
                  onClick={() => onDeleteFile(file.id!)}
                  className="p-1 rounded transition-colors"
                  style={{ color: colors.dangerEmphasis }}
                  title="Delete document permanently"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}