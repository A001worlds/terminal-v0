import React from 'react'
import { Colors, TabStats } from '../../../lib/types'

interface StatsGridProps {
  activeTab: string
  stats: TabStats
  colors: Colors
}

const getStatsLabels = (tab: string) => {
  switch (tab) {
    case 'catalog':
      return {
        total: 'Total tracks',
        lastUpload: 'Last upload',
        newUploads: 'New uploads'
      }
    case 'royalties':
      return {
        total: 'Total statements',
        lastUpload: 'Last upload',
        newUploads: 'New uploads'
      }
    case 'agreements':
      return {
        total: 'Total agreements',
        lastUpload: 'Last upload',
        newUploads: 'New uploads'
      }
    case 'archive':
      return {
        total: 'Archived documents',
        lastUpload: 'Last archived',
        newUploads: 'New uploads'
      }
    default:
      return {
        total: 'Total items',
        lastUpload: 'Last upload',
        newUploads: 'New uploads'
      }
  }
}

export default function StatsGrid({ activeTab, stats, colors }: StatsGridProps) {
  const labels = getStatsLabels(activeTab)

  return (
    <div 
      className="grid grid-cols-3 gap-4 p-4 rounded-md mb-6"
      style={{ backgroundColor: colors.canvasDefault }}
    >
      <div>
        <div className="text-2xl font-bold" style={{ color: colors.fgDefault }}>
          {stats.total.toLocaleString()}
        </div>
        <div className="text-sm" style={{ color: colors.fgMuted }}>
          {labels.total}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold" style={{ color: colors.fgDefault }}>
          {stats.lastUpload}
        </div>
        <div className="text-sm" style={{ color: colors.fgMuted }}>
          {labels.lastUpload}
        </div>
      </div>
      <div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: colors.fgDefault }}>
            {stats.newUploads}
          </div>
          <div className="text-sm" style={{ color: colors.fgMuted }}>
            {labels.newUploads}
          </div>
        </div>
      </div>
    </div>
  )
}