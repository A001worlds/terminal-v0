import React from 'react'
import { Info } from 'lucide-react'
import { Colors } from '../../../lib/types'

interface HelpSectionProps {
  activeTab: string
  colors: Colors
}

const getHelpContent = (tab: string) => {
  switch (tab) {
    case 'catalog':
      return {
        title: 'Catalog Format Requirements',
        description: 'CSV must include: Track Title, Artist, ISRC, Duration. Optional: Album, Label, Release Date.'
      }
    case 'royalties':
      return {
        title: 'Royalty Statement Processing',
        description: 'We support statements from: Spotify, Apple Music, YouTube, TikTok, and 50+ other platforms. PDF statements are automatically processed.'
      }
    case 'agreements':
      return {
        title: 'Agreement Storage',
        description: 'Agreements are securely stored and can be referenced during reconciliation. PDF contracts are indexed for search.'
      }
    case 'archive':
      return {
        title: 'Archive Management',
        description: 'View and manage all archived documents across all categories. Use the unarchive button to restore documents back to active status.'
      }
    default:
      return {
        title: 'Help',
        description: 'Upload and manage your music rights documents.'
      }
  }
}

export default function HelpSection({ activeTab, colors }: HelpSectionProps) {
  const content = getHelpContent(activeTab)

  return (
    <div 
      className="p-4 rounded-md"
      style={{ 
        backgroundColor: colors.canvasDefault,
        border: `1px solid ${colors.borderDefault}`
      }}
    >
      <div className="flex items-start space-x-2">
        <Info className="w-4 h-4 mt-0.5" style={{ color: colors.fgMuted }} />
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: colors.fgDefault }}>
            {content.title}
          </p>
          <p className="text-sm" style={{ color: colors.fgMuted }}>
            {content.description}
          </p>
        </div>
      </div>
    </div>
  )
}