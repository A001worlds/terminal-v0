import React from 'react'
import { FileUp } from 'lucide-react'
import { Colors } from '../../../lib/types'

interface UploadAreaProps {
  activeTab: string
  dragActive: boolean
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onBrowseClick: () => void
  colors: Colors
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const getAcceptedTypes = (tab: string) => {
  switch (tab) {
    case 'catalog':
      return '.csv,.xls,.xlsx'
    case 'royalties':
      return '.csv,.xls,.xlsx,.pdf'
    case 'agreements':
      return '.pdf,.doc,.docx,.txt'
    default:
      return '*'
  }
}

const getFileDescription = (tab: string) => {
  switch (tab) {
    case 'catalog':
      return 'Supports CSV, XLSX, XLS files'
    case 'royalties':
      return 'Supports CSV, XLSX, XLS, PDF files'
    case 'agreements':
      return 'Supports PDF, DOC, DOCX, TXT files'
    default:
      return 'All file types supported'
  }
}

export default function UploadArea({
  activeTab,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onBrowseClick,
  colors,
  fileInputRef,
  onFileChange
}: UploadAreaProps) {
  if (activeTab === 'archive') return null

  return (
    <div 
      className="rounded-md p-6 mb-6"
      style={{ 
        backgroundColor: colors.canvasSubtle,
        border: `1px solid ${colors.borderDefault}`
      }}
    >
      <div
        className="rounded-md p-12 text-center transition-all"
        style={{
          backgroundColor: dragActive ? colors.accentSubtle : colors.canvasDefault,
          border: `2px dashed ${dragActive ? colors.accentEmphasis : colors.borderDefault}`
        }}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptedTypes(activeTab)}
          onChange={onFileChange}
          className="hidden"
        />
        
        <FileUp 
          className="w-12 h-12 mx-auto mb-4" 
          style={{ color: colors.fgMuted }}
        />
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.fgDefault }}>
          Drop your files here, or{' '}
          <button
            onClick={onBrowseClick}
            className="underline"
            style={{ color: colors.accentEmphasis }}
          >
            browse
          </button>
        </h3>
        <p className="text-sm" style={{ color: colors.fgMuted }}>
          {getFileDescription(activeTab)}
        </p>
      </div>
    </div>
  )
}