/**
 * N/A Protocol Music Rights Monitoring Dashboard
 * Provides real-time monitoring and management of music rights across digital platforms
 */
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { UploadService } from '../../../lib/uploadService'
import { Upload, TabStats } from '../../../lib/types'
import { getGitHubColors } from '../../../lib/utils/colors'
import { useUploads } from '../../../lib/hooks/useUploads'
import { useFileUpload } from '../../../lib/hooks/useFileUpload'

// Components
import TabNavigation from './TabNavigation'
import UploadArea from './UploadArea'
import StatsGrid from './StatsGrid'
import DocumentList from './DocumentList'
import HelpSection from './HelpSection'

export default function NAProtocolDashboard() {
  // State
  const [activeTab, setActiveTab] = useState('catalog')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [archiveEnabled, setArchiveEnabled] = useState(true)

  // Colors
  const colors = getGitHubColors()

  // Custom hooks
  const {
    uploads,
    loading,
    error,
    refreshUploads,
    archiveUpload,
    unarchiveUpload,
    deleteUpload,
    bulkDeleteUploads,
    bulkArchiveUploads
  } = useUploads(activeTab)

  const {
    uploadedFiles,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    fileInputRef,
    clearUploadedFiles
  } = useFileUpload(activeTab, refreshUploads)

  // Check archive functionality availability
  useEffect(() => {
    const checkArchiveSupport = async () => {
      try {
        await UploadService.getUploadsWithFilter({ 
          includeArchived: true,
          limit: 1 
        })
        setArchiveEnabled(true)
      } catch (error) {
        if (error instanceof Error && error.message.includes('archived')) {
          setArchiveEnabled(false)
        }
      }
    }
    checkArchiveSupport()
  }, [])

  // Stats calculation
  const getTabStats = useCallback((tab: string): TabStats => {
    const filteredUploads = tab === 'archive' 
      ? uploads.filter(u => u.archived)
      : uploads.filter(u => !u.archived && (tab === 'all' || u.tab_category === tab))

    const total = filteredUploads.length
    const dates = filteredUploads
      .map(u => u.uploaded_at || u.archived_at)
      .filter(Boolean)
      .sort()
    
    const lastUpload = dates.length > 0 
      ? new Date(dates[dates.length - 1]!).toLocaleDateString()
      : 'None'

    // Calculate new uploads (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const newUploads = filteredUploads.filter(u => {
      const uploadDate = new Date(u.uploaded_at || 0)
      return uploadDate > weekAgo
    }).length

    return { total, lastUpload, newUploads }
  }, [uploads])

  // File selection handlers
  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileId)) {
        newSet.delete(fileId)
      } else {
        newSet.add(fileId)
      }
      return newSet
    })
  }, [])

  const selectAllFiles = useCallback(() => {
    const allIds = uploads.filter(u => u.id).map(u => u.id!)
    setSelectedFiles(new Set(allIds))
  }, [uploads])

  // File operation handlers
  const handleArchiveFile = useCallback(async (fileId: string) => {
    await archiveUpload(fileId)
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      newSet.delete(fileId)
      return newSet
    })
  }, [archiveUpload])

  const handleUnarchiveFile = useCallback(async (fileId: string) => {
    await unarchiveUpload(fileId)
  }, [unarchiveUpload])

  const handleDeleteFile = useCallback(async (fileId: string) => {
    await deleteUpload(fileId)
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      newSet.delete(fileId)
      return newSet
    })
  }, [deleteUpload])

  const handleBulkDelete = useCallback(async () => {
    if (selectedFiles.size === 0) return
    await bulkDeleteUploads(Array.from(selectedFiles))
    setSelectedFiles(new Set())
  }, [selectedFiles, bulkDeleteUploads])

  const handleBulkArchive = useCallback(async () => {
    if (selectedFiles.size === 0) return
    await bulkArchiveUploads(Array.from(selectedFiles))
    setSelectedFiles(new Set())
  }, [selectedFiles, bulkArchiveUploads])

  // Tab change handler
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setSelectedFiles(new Set())
    clearUploadedFiles()
  }, [clearUploadedFiles])

  // File input handlers
  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [fileInputRef])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.bgDefault }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.fgDefault }}>
            N/A Protocol Dashboard
          </h1>
          <p className="text-lg" style={{ color: colors.fgMuted }}>
            Music Rights Monitoring & Management Platform
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div 
            className="p-4 rounded-md mb-6"
            style={{ 
              backgroundColor: colors.dangerSubtle,
              border: `1px solid ${colors.dangerEmphasis}`,
              color: colors.dangerFg
            }}
          >
            {error}
          </div>
        )}

        {/* Archive Warning */}
        {!archiveEnabled && (
          <div 
            className="p-4 rounded-md mb-6"
            style={{ 
              backgroundColor: colors.attentionSubtle,
              border: `1px solid ${colors.attentionEmphasis}`,
              color: colors.attentionFg
            }}
          >
            Archive functionality is not available. Database migration may be required.
          </div>
        )}

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          colors={colors}
        />

        {/* Main Content Area */}
        <div>
          {/* Upload Area - Only show for non-archive tabs */}
          {activeTab !== 'archive' && (
            <div 
              className="rounded-md p-6 mb-6"
              style={{ 
                backgroundColor: colors.canvasSubtle,
                border: `1px solid ${colors.borderDefault}`
              }}
            >
              <UploadArea
                activeTab={activeTab}
                dragActive={dragActive}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onBrowseClick={handleBrowseClick}
                colors={colors}
                fileInputRef={fileInputRef}
                onFileChange={handleFileInputChange}
              />

              {/* Stats Grid */}
              <StatsGrid
                activeTab={activeTab}
                stats={getTabStats(activeTab)}
                colors={colors}
              />

              {/* Document List */}
              <DocumentList
                uploads={uploads}
                uploadedFiles={uploadedFiles}
                loading={loading}
                activeTab={activeTab}
                selectedFiles={selectedFiles}
                archiveEnabled={archiveEnabled}
                colors={colors}
                onToggleSelection={toggleFileSelection}
                onSelectAll={selectAllFiles}
                onArchiveFile={handleArchiveFile}
                onUnarchiveFile={handleUnarchiveFile}
                onDeleteFile={handleDeleteFile}
              />

              {/* Help Section */}
              <HelpSection activeTab={activeTab} colors={colors} />
            </div>
          )}

          {/* Archive Tab Content */}
          {activeTab === 'archive' && (
            <div 
              className="rounded-md p-6"
              style={{ 
                backgroundColor: colors.canvasSubtle,
                border: `1px solid ${colors.borderDefault}`
              }}
            >
              {/* Stats Grid */}
              <StatsGrid
                activeTab={activeTab}
                stats={getTabStats(activeTab)}
                colors={colors}
              />

              {/* Document List */}
              <DocumentList
                uploads={uploads}
                uploadedFiles={[]}
                loading={loading}
                activeTab={activeTab}
                selectedFiles={selectedFiles}
                archiveEnabled={archiveEnabled}
                colors={colors}
                onToggleSelection={toggleFileSelection}
                onSelectAll={selectAllFiles}
                onArchiveFile={handleArchiveFile}
                onUnarchiveFile={handleUnarchiveFile}
                onDeleteFile={handleDeleteFile}
              />

              {/* Help Section */}
              <HelpSection activeTab={activeTab} colors={colors} />
            </div>
          )}
        </div>

        {/* Bulk Actions - Show when files are selected */}
        {selectedFiles.size > 0 && (
          <div 
            className="fixed bottom-6 right-6 p-4 rounded-md shadow-lg"
            style={{ 
              backgroundColor: colors.canvasDefault,
              border: `1px solid ${colors.borderDefault}`
            }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm" style={{ color: colors.fgDefault }}>
                {selectedFiles.size} selected
              </span>
              {archiveEnabled && activeTab !== 'archive' && (
                <button
                  onClick={handleBulkArchive}
                  className="px-3 py-1 text-sm rounded transition-colors"
                  style={{
                    backgroundColor: colors.attentionEmphasis,
                    color: colors.btnText
                  }}
                >
                  Archive
                </button>
              )}
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm rounded transition-colors"
                style={{
                  backgroundColor: colors.dangerEmphasis,
                  color: colors.btnText
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedFiles(new Set())}
                className="px-3 py-1 text-sm rounded transition-colors"
                style={{
                  backgroundColor: colors.btnBg,
                  color: colors.fgDefault,
                  border: `1px solid ${colors.btnBorder}`
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}