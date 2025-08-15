// app/dashboard/page.tsx
// This is your complete N/A Protocol Dashboard
// Just copy this entire file into your project

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Upload,
  FileText,
  Settings,
  Search,
  Bell,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Eye,
  Zap,
  Circle,
  X,
  Info,
  Menu,
  BarChart3,
  Music,
  ExternalLink,
  FileUp,
  File,
  CheckCircle,
  XCircle,
  Loader,
  Database,
  FileSpreadsheet,
  FileMusic
} from 'lucide-react';

// GitHub Primer color palette
const colors = {
  canvasDefault: '#0d1117',
  canvasSubtle: '#010409',
  canvasInset: '#010409',
  canvasOverlay: '#161b22',
  fgDefault: '#e6edf3',
  fgMuted: '#7d8590',
  fgSubtle: '#6e7681',
  fgOnEmphasis: '#ffffff',
  borderDefault: '#30363d',
  borderMuted: '#21262d',
  borderSubtle: '#161b22',
  neutralEmphasis: '#6e7681',
  neutralEmphasisPlus: '#7d8590',
  accentEmphasis: '#2f81f7',
  accentMuted: 'rgba(56, 139, 253, 0.1)',
  accentSubtle: 'rgba(56, 139, 253, 0.15)',
  successEmphasis: '#3fb950',
  attentionEmphasis: '#d29922',
  dangerEmphasis: '#f85149',
  headerBg: '#010409',
  sidebarBg: '#010409',
  btnBg: '#21262d',
  btnHover: '#30363d',
  btnBorder: '#30363d',
  btnPrimary: '#238636',
  btnPrimaryHover: '#2ea043',
};

// Mock data - replace with real data from Supabase
const mockDetections = {
  critical: [
    { id: 'NA-001', track: 'Midnight Dreams', artist: 'Luna Vista', platform: 'YouTube', type: 'Unreported Sync', value: 3400, confidence: 98, status: 'new', time: '2 min ago', views: '2.3M' },
    { id: 'NA-002', track: 'Summer Vibes', artist: 'Echo Collective', platform: 'TikTok', type: 'Viral Usage', value: 2750, confidence: 95, status: 'new', time: '8 min ago', views: '5.1M' },
    { id: 'NA-003', track: 'Electric Soul', artist: 'Digital Dreamers', platform: 'Instagram', type: 'Commercial Use', value: 1890, confidence: 96, status: 'new', time: '15 min ago', views: '890K' }
  ],
  review: [
    { id: 'NA-004', track: 'Ocean Waves', artist: 'Coastal Sound', platform: 'Spotify', type: 'Playlist Add', value: 890, confidence: 87, status: 'pending', time: '1 hour ago', streams: '450K' },
    { id: 'NA-005', track: 'City Lights', artist: 'Urban Echo', platform: 'YouTube', type: 'Background Music', value: 650, confidence: 82, status: 'pending', time: '2 hours ago', views: '1.2M' },
  ],
  monitoring: [
    { id: 'NA-009', track: 'Morning Coffee', artist: 'Cafe Sounds', platform: 'YouTube', type: 'Potential Match', value: 120, confidence: 72, status: 'monitoring', time: '6 hours ago' },
  ],
  processed: [
    { id: 'NA-011', track: 'Victory Lap', artist: 'Champion Sound', platform: 'ESPN', type: 'Sports Sync', value: 5200, confidence: 99, status: 'claimed', time: 'Yesterday', result: 'Claimed' },
  ]
};

const navigationItems = [
  { id: 'feed', label: 'Detection Feed', icon: Activity, badge: '14' },
  { id: 'upload', label: 'Upload Center', icon: Upload, badge: null },
  { id: 'reports', label: 'Reports', icon: FileText, badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

// Component definitions
const Sidebar = ({ activeView, setActiveView, expanded }: any) => {
  return (
    <div 
      className={`${expanded ? 'w-64' : 'w-16'} flex flex-col transition-all duration-300 ease-in-out`}
      style={{ 
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.borderDefault}`
      }}
    >
      <div 
        className="h-14 flex items-center px-4"
        style={{ borderBottom: `1px solid ${colors.borderDefault}` }}
      >
        <div 
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ backgroundColor: colors.fgDefault }}
        >
          <span className="font-bold text-sm" style={{ color: colors.canvasDefault }}>N/A</span>
        </div>
        {expanded && (
          <span className="ml-2 font-semibold" style={{ color: colors.fgDefault }}>Protocol</span>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            isExpanded={expanded}
            onClick={() => setActiveView(item.id)}
          />
        ))}
      </nav>

      <div className="p-3" style={{ borderTop: `1px solid ${colors.borderDefault}` }}>
        <div className="flex items-center justify-center">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.successEmphasis }} />
          {expanded && (
            <span className="ml-2 text-xs" style={{ color: colors.fgMuted }}>System Active</span>
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ item, isActive, isExpanded, onClick }: any) => {
  const Icon = item.icon;
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'} py-2 rounded-md transition-colors`}
        style={{ 
          backgroundColor: isActive ? colors.btnBg : 'transparent',
          color: isActive ? colors.fgDefault : colors.fgMuted
        }}
        onMouseEnter={(e: any) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = colors.btnBg;
            e.currentTarget.style.color = colors.fgDefault;
          }
        }}
        onMouseLeave={(e: any) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.fgMuted;
          }
        }}
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5" />
          {isExpanded && (
            <span className="ml-3 text-sm font-medium">{item.label}</span>
          )}
        </div>
        {isExpanded && item.badge && (
          <span 
            className="px-2 py-0.5 text-xs rounded-full"
            style={{ 
              backgroundColor: colors.accentMuted,
              color: colors.accentEmphasis 
            }}
          >
            {item.badge}
          </span>
        )}
      </button>
    </div>
  );
};

const Header = ({ title, lastUpdated }: any) => {
  const [query, setQuery] = useState('');
  
  return (
    <header 
      className="h-14 flex items-center justify-between px-6"
      style={{ 
        backgroundColor: colors.headerBg,
        borderBottom: `1px solid ${colors.borderDefault}`
      }}
    >
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold" style={{ color: colors.fgDefault }}>{title}</h1>
        {lastUpdated && (
          <span className="text-xs" style={{ color: colors.fgMuted }}>
            Last updated {lastUpdated}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search detections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm rounded-md focus:outline-none"
            style={{ 
              backgroundColor: colors.canvasDefault,
              color: colors.fgDefault,
              border: `1px solid ${colors.borderDefault}`
            }}
          />
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: colors.fgMuted }} />
        </div>
        <button className="relative p-1.5" style={{ color: colors.fgMuted }}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentEmphasis }} />
        </button>
      </div>
    </header>
  );
};

const FeedView = () => {
  const [expandedSections, setExpandedSections] = useState({
    critical: true,
    review: true,
    monitoring: false,
    processed: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="p-6 space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Circle className="w-2 h-2 animate-pulse" fill={colors.successEmphasis} />
            <span className="text-sm font-medium" style={{ color: colors.fgMuted }}>Scanning</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" style={{ color: colors.fgSubtle }} />
            <span className="font-semibold" style={{ color: colors.fgDefault }}>$47,293</span>
            <span style={{ color: colors.fgMuted }}>potential</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" style={{ color: colors.fgSubtle }} />
            <span className="font-semibold" style={{ color: colors.fgDefault }}>142</span>
            <span style={{ color: colors.fgMuted }}>active</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4" style={{ color: colors.fgSubtle }} />
            <span className="font-semibold" style={{ color: colors.fgDefault }}>94.2%</span>
            <span style={{ color: colors.fgMuted }}>confidence</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="px-3 py-1.5 text-sm rounded-md flex items-center space-x-1"
            style={{ 
              backgroundColor: colors.btnBg,
              color: colors.fgDefault,
              border: `1px solid ${colors.btnBorder}`
            }}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button 
            className="px-3 py-1.5 text-sm rounded-md flex items-center space-x-1"
            style={{ 
              backgroundColor: colors.btnBg,
              color: colors.fgDefault,
              border: `1px solid ${colors.btnBorder}`
            }}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Detection Groups */}
      {Object.entries(mockDetections).map(([key, detections]) => (
        <DetectionGroup
          key={key}
          title={key === 'critical' ? 'Critical Detections' : 
                key === 'review' ? 'Needs Review' :
                key === 'monitoring' ? 'Monitoring' : 'Processed'}
          detections={detections}
          expanded={expandedSections[key as keyof typeof expandedSections]}
          onToggle={() => toggleSection(key)}
        />
      ))}
    </div>
  );
};

const DetectionGroup = ({ title, detections, expanded, onToggle }: any) => {
  const totalValue = detections.reduce((sum: number, item: any) => sum + item.value, 0);

  return (
    <div 
      className="rounded-md overflow-hidden"
      style={{ 
        backgroundColor: colors.canvasSubtle,
        border: `1px solid ${colors.borderDefault}`
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="flex items-center space-x-3">
          {expanded ? 
            <ChevronDown className="w-4 h-4" style={{ color: colors.fgMuted }} /> : 
            <ChevronRight className="w-4 h-4" style={{ color: colors.fgMuted }} />
          }
          <span className="text-sm font-semibold" style={{ color: colors.fgDefault }}>{title}</span>
          <span 
            className="px-2 py-0.5 text-xs rounded-full"
            style={{ 
              backgroundColor: colors.btnBg,
              color: colors.fgMuted
            }}
          >
            {detections.length}
          </span>
        </div>
        <div className="text-sm" style={{ color: colors.fgMuted }}>${totalValue.toLocaleString()}</div>
      </button>
      
      {expanded && (
        <div style={{ borderTop: `1px solid ${colors.borderDefault}` }}>
          {detections.map((detection: any) => (
            <div 
              key={detection.id}
              className="px-4 py-3"
              style={{ borderTop: `1px solid ${colors.borderSubtle}` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-mono" style={{ color: colors.fgSubtle }}>{detection.id}</span>
                    <Circle className="w-1.5 h-1.5" fill={detection.confidence >= 95 ? colors.successEmphasis : colors.attentionEmphasis} />
                    <span className="text-xs" style={{ color: colors.fgSubtle }}>{detection.time}</span>
                  </div>
                  <div className="font-medium" style={{ color: colors.fgDefault }}>{detection.track}</div>
                  <div className="text-sm" style={{ color: colors.fgMuted }}>
                    {detection.artist} • {detection.platform} • {detection.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold" style={{ color: colors.fgDefault }}>${detection.value.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: colors.fgSubtle }}>{detection.confidence}% confidence</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UploadCenter = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6" style={{ color: colors.fgDefault }}>
        Upload Center
      </h2>
      
      {/* Simplified upload area */}
      <div 
        className="rounded-md p-12 text-center"
        style={{
          backgroundColor: dragActive ? colors.accentSubtle : colors.canvasSubtle,
          border: `2px dashed ${dragActive ? colors.accentEmphasis : colors.borderDefault}`
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />
        
        <FileUp className="w-12 h-12 mx-auto mb-4" style={{ color: colors.fgMuted }} />
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.fgDefault }}>
          Drop your files here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="underline"
            style={{ color: colors.accentEmphasis }}
          >
            browse
          </button>
        </h3>
        <p className="text-sm" style={{ color: colors.fgMuted }}>
          Supports CSV, XLSX, XLS files
        </p>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function NAProtocolDashboard() {
  const [activeView, setActiveView] = useState('feed');
  const [sidebarExpanded] = useState(false);

  const getViewTitle = () => {
    switch(activeView) {
      case 'feed': return 'Detection Feed';
      case 'upload': return 'Upload Center';
      case 'reports': return 'Reports';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      default: return 'Detection Feed';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.canvasDefault }}>
      <div className="flex h-screen" style={{ backgroundColor: colors.canvasDefault }}>
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          expanded={sidebarExpanded}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title={getViewTitle()} 
            lastUpdated={activeView === 'feed' ? new Date().toLocaleTimeString() : null}
          />
          
          <main className="flex-1 overflow-auto" style={{ backgroundColor: colors.canvasDefault }}>
            {activeView === 'feed' && <FeedView />}
            {activeView === 'upload' && <UploadCenter />}
            {activeView === 'reports' && (
              <div className="p-6" style={{ color: colors.fgMuted }}>Reports - Coming Soon</div>
            )}
            {activeView === 'analytics' && (
              <div className="p-6" style={{ color: colors.fgMuted }}>Analytics - Coming Soon</div>
            )}
            {activeView === 'settings' && (
              <div className="p-6" style={{ color: colors.fgMuted }}>Settings - Coming Soon</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}