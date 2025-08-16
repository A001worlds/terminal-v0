import React from 'react'
import { Music, DollarSign, FileText, Archive } from 'lucide-react'
import { TabData, Colors } from '../../../lib/types'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  colors: Colors
}

const tabs: TabData[] = [
  { id: 'catalog', label: 'Catalog', icon: Music },
  { id: 'royalties', label: 'Royalty Statements', icon: DollarSign },
  { id: 'agreements', label: 'Agreements', icon: FileText },
  { id: 'archive', label: 'Archive', icon: Archive }
]

export default function TabNavigation({ activeTab, onTabChange, colors }: TabNavigationProps) {
  return (
    <div className="flex space-x-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex items-center space-x-2 px-4 py-2 rounded-t-md transition-all"
          style={{
            backgroundColor: activeTab === tab.id ? colors.canvasDefault : colors.canvasSubtle,
            color: activeTab === tab.id ? colors.fgDefault : colors.fgMuted,
            borderTop: `2px solid ${activeTab === tab.id ? colors.accentEmphasis : 'transparent'}`,
            borderLeft: `1px solid ${activeTab === tab.id ? colors.borderDefault : 'transparent'}`,
            borderRight: `1px solid ${activeTab === tab.id ? colors.borderDefault : 'transparent'}`
          }}
        >
          <tab.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}