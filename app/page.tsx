'use client'

import { useState, useEffect } from 'react'

export default function Page() {
  const [detections, setDetections] = useState<any[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [stats, setStats] = useState({ total: 0, platforms: {} as any })

  // Mock detections data
  const mockDetections = [
    { id: 1, platform: 'youtube', title: 'Shape of You (AI Cover)', confidence: 87, type: 'ai_cover', time: '2 mins ago' },
    { id: 2, platform: 'tiktok', title: 'Bad Guy Remix', confidence: 72, type: 'remix', time: '5 mins ago' },
    { id: 3, platform: 'reddit', title: 'Leaked: Blinding Lights', confidence: 91, type: 'leak', time: '12 mins ago' },
    { id: 4, platform: 'soundcloud', title: 'Levitating Bootleg', confidence: 65, type: 'bootleg', time: '18 mins ago' },
  ]

  useEffect(() => {
    // Load initial detections
    setDetections(mockDetections)
    updateStats(mockDetections)
  }, [])

  const updateStats = (data: any[]) => {
    const platforms = data.reduce((acc, d) => {
      acc[d.platform] = (acc[d.platform] || 0) + 1
      return acc
    }, {})
    setStats({ total: data.length, platforms })
  }

  const runScan = () => {
    setIsScanning(true)
    
    // Simulate scanning
    setTimeout(() => {
      const newDetection = {
        id: Date.now(),
        platform: ['youtube', 'tiktok', 'reddit', 'soundcloud'][Math.floor(Math.random() * 4)],
        title: `New Detection ${Date.now()}`,
        confidence: Math.floor(Math.random() * 40) + 60,
        type: ['ai_cover', 'remix', 'leak', 'bootleg'][Math.floor(Math.random() * 4)],
        time: 'just now'
      }
      
      const newDetections = [newDetection, ...detections]
      setDetections(newDetections)
      updateStats(newDetections)
      setIsScanning(false)
    }, 2000)
  }

  const getPlatformColor = (platform: string) => {
    const colors: any = {
      youtube: 'text-red-500',
      tiktok: 'text-pink-500',
      reddit: 'text-orange-500',
      soundcloud: 'text-yellow-500'
    }
    return colors[platform] || 'text-green-500'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-red-400'
    if (confidence >= 60) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 overflow-hidden">
      {/* Scan line effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse pointer-events-none" />
      
      {/* Header */}
      <div className="border-2 border-green-500 p-4 mb-4">
        <h1 className="text-2xl font-bold text-center animate-pulse">
          A001 TERMINAL v0 - SURVEILLANCE SYSTEM
        </h1>
        <p className="text-center text-xs mt-2 text-green-400">
          MUSIC BREACH DETECTION PROTOCOL ACTIVE
        </p>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="border border-green-500 p-3">
          <div className="text-xs text-green-400">TOTAL DETECTIONS</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="border border-green-500 p-3">
          <div className="text-xs text-green-400">YOUTUBE</div>
          <div className="text-2xl font-bold">{stats.platforms.youtube || 0}</div>
        </div>
        <div className="border border-green-500 p-3">
          <div className="text-xs text-green-400">TIKTOK</div>
          <div className="text-2xl font-bold">{stats.platforms.tiktok || 0}</div>
        </div>
        <div className="border border-green-500 p-3">
          <div className="text-xs text-green-400">AVG CONFIDENCE</div>
          <div className="text-2xl font-bold">
            {detections.length > 0 
              ? Math.round(detections.reduce((acc, d) => acc + d.confidence, 0) / detections.length)
              : 0}%
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <button
        onClick={runScan}
        disabled={isScanning}
        className={`w-full mb-4 p-4 border-2 ${
          isScanning 
            ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 animate-pulse' 
            : 'border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/20'
        } font-bold transition-all`}
      >
        {isScanning ? '⚡ SCANNING...' : '▶ INITIATE SCAN'}
      </button>

      {/* ParseBot Test Button */}
      <button
        onClick={async () => {
          try {
            const response = await fetch('/api/parsebot', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                action: 'search', 
                query: 'Shape of You AI Cover' 
              })
            });
            const data = await response.json();
            console.log('ParseBot results:', data);
            alert('ParseBot results: ' + JSON.stringify(data).substring(0, 200));
          } catch (error) {
            alert('ParseBot error: ' + error);
          }
        }}
        className="w-full mb-4 p-4 border-2 border-blue-500 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 font-bold transition-all"
      >
        🔍 TEST PARSEBOT API
      </button>

      {/* Detection Feed */}
      <div className="border border-green-500 p-4">
        <div className="text-xs text-green-400 mb-2">▼ LIVE DETECTION FEED</div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {detections.map((detection) => (
            <div key={detection.id} className="border-l-2 border-green-500 pl-2 py-1">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${getPlatformColor(detection.platform)}`}>
                  [{detection.platform.toUpperCase()}]
                </span>
                <span className="text-green-300">{detection.title}</span>
                <span className={`ml-auto ${getConfidenceColor(detection.confidence)}`}>
                  {detection.confidence}%
                </span>
              </div>
              <div className="text-xs text-green-400/60">
                Type: {detection.type} | {detection.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-green-400/50">
        SYSTEM OPERATIONAL | OBSERVER_77 ACTIVE | {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
