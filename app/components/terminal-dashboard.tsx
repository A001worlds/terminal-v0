"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, TerminalSquare } from 'lucide-react'
import { generateRandomDetections, type Detection } from "@/lib/generate-detections"

const initialDetections: Detection[] = [
  {
    id: "seed-yt-1",
    platform: "YouTube",
    title: "Shape of You (AI Cover)",
    confidence: 87,
    type: "AI Cover",
    timestamp: new Date().toISOString(),
    fresh: true,
  },
  {
    id: "seed-tt-1",
    platform: "TikTok",
    title: "Bad Guy Remix",
    confidence: 72,
    type: "Remix",
    timestamp: new Date().toISOString(),
    fresh: true,
  },
  {
    id: "seed-rd-1",
    platform: "Reddit",
    title: "Leaked: Blinding Lights",
    confidence: 91,
    type: "Leak",
    timestamp: new Date().toISOString(),
    fresh: true,
  },
  {
    id: "seed-sc-1",
    platform: "SoundCloud",
    title: "Levitating Bootleg",
    confidence: 65,
    type: "Bootleg",
    timestamp: new Date().toISOString(),
    fresh: true,
  },
]

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const hh = String(d.getHours()).padStart(2, "0")
  const mi = String(d.getMinutes()).padStart(2, "0")
  const ss = String(d.getSeconds()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

export function TerminalDashboard() {
  const [detections, setDetections] = useState<Detection[]>(initialDetections)
  const [scanning, setScanning] = useState(false)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setDetections(prev => prev.map(d => ({ ...d, fresh: false })))
    })
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!feedRef.current) return
    feedRef.current.scrollTop = 0
  }, [detections])

  const stats = useMemo(() => {
    const total = detections.length
    const avg =
      total === 0
        ? 0
        : Math.round(
            (detections.reduce((acc, d) => acc + d.confidence, 0) / total) * 10
          ) / 10
    const platformMap = new Map<string, number>()
    detections.forEach(d => {
      platformMap.set(d.platform, (platformMap.get(d.platform) ?? 0) + 1)
    })
    const breakdown = Array.from(platformMap.entries()).map(([name, count]) => ({
      name,
      count,
    }))
    breakdown.sort((a, b) => b.count - a.count)
    return { total, avg, breakdown }
  }, [detections])

  function handleScan() {
    if (scanning) return
    setScanning(true)
    const delay = 800 + Math.random() * 700
    setTimeout(() => {
      const batch = generateRandomDetections()
      setDetections(prev => [...batch, ...prev])
      setScanning(false)
    }, delay)
  }

  return (
    <div className="relative">
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-10">
        {/* Header */}
        <header className="mb-6 md:mb-10">
          <div className="flex items-center gap-3 text-emerald-400">
            <TerminalSquare className="h-6 w-6 md:h-7 md:w-7" />
            <span className="text-sm md:text-base tracking-widest opacity-80">
              PROTOCOL A001
            </span>
          </div>
          <h1
            className="glitch text-2xl md:text-4xl lg:text-5xl font-semibold mt-2 tracking-widest text-emerald-300"
            data-text="A001 TERMINAL v0 - SURVEILLANCE SYSTEM"
          >
            A001 TERMINAL v0 - SURVEILLANCE SYSTEM
          </h1>
          <p className="mt-2 text-emerald-500/80 crt-flicker text-xs md:text-sm">
            Status: LINK ESTABLISHED <span className="blink">_</span>
          </p>
        </header>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            onClick={handleScan}
            className="h-12 md:h-14 px-6 md:px-8 text-lg md:text-xl font-semibold tracking-wider bg-emerald-600 hover:bg-emerald-500 text-black"
            aria-pressed={scanning}
          >
            <Play className="mr-2 h-5 w-5" />
            INITIATE SCAN
          </Button>
          <div className="text-emerald-400 text-sm md:text-base">
            <span className="amber mr-2">[SCANNER]</span>
            VECTOR SWEEP: {scanning ? "ACTIVE" : "IDLE"}
            {scanning && <span className="blink">_</span>}
          </div>
        </div>

        {/* Grid: Feed + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Detection Feed */}
          <Card className="bg-black/60 border-emerald-900/40 relative overflow-hidden lg:col-span-2">
            <CardHeader className="border-b border-emerald-900/40">
              <CardTitle className="text-emerald-300 tracking-wider">
                LIVE DETECTION FEED
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={feedRef}
                className="max-h-[60vh] overflow-y-auto custom-scroll px-4 py-4 space-y-2"
                aria-live="polite"
                aria-relevant="additions"
              >
                {detections.map((d) => (
                  <FeedLine key={d.id} detection={d} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="space-y-6">
            <Card className="bg-black/60 border-emerald-900/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-300 tracking-wider">
                  STATS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <StatBlock
                    label="TOTAL DETECTIONS"
                    value={String(stats.total).padStart(4, "0")}
                  />
                  <StatBlock
                    label="AVG CONFIDENCE"
                    value={`${stats.avg.toFixed(1)}%`}
                  />
                </div>
                <div>
                  <div className="text-xs text-emerald-500/90 tracking-widest mb-2">
                    PLATFORM BREAKDOWN
                  </div>
                  <div className="space-y-2">
                    {stats.breakdown.length === 0 && (
                      <div className="text-emerald-500/70 text-sm">
                        No data
                      </div>
                    )}
                    {stats.breakdown.map((p) => {
                      const pct =
                        stats.total === 0
                          ? 0
                          : Math.round((p.count / stats.total) * 100)
                      return (
                        <div key={p.name}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="amber">[{p.name}]</span>
                            <span className="text-emerald-400">
                              {String(p.count).padStart(3, "0")} • {pct}%
                            </span>
                          </div>
                          <div className="h-2 mt-1 bg-emerald-900/40 rounded">
                            <div
                              className="h-full rounded bg-emerald-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-emerald-900/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-emerald-300 tracking-wider">
                  SYSTEM LOG
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-emerald-400/80 text-sm space-y-1">
                  <div>
                    <span className="amber">[A001]</span> surveillance pipeline initialized
                  </div>
                  <div className="opacity-80">
                    <span className="amber">[CORE]</span> signal amplification: OK
                  </div>
                  <div className="opacity-80">
                    <span className="amber">[NET]</span> endpoints linked: 8
                  </div>
                  <div className="opacity-80">
                    <span className="amber">[SCAN]</span> ready for vector sweep
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(52, 211, 153, 0.35) rgba(6, 78, 59, 0.25);
        }
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(52, 211, 153, 0.35);
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}

function FeedLine({ detection }: { detection: Detection }) {
  const [animate, setAnimate] = useState(!!detection.fresh)
  useEffect(() => {
    if (!animate) return
    const id = setTimeout(() => setAnimate(false), 420)
    return () => clearTimeout(id)
  }, [animate])

  const time = formatTimestamp(detection.timestamp)

  return (
    <div
      className={`whitespace-pre-wrap text-sm md:text-base leading-relaxed ${
        animate ? "line-enter" : ""
      }`}
      role="status"
    >
      <span className="amber font-semibold">[{detection.platform}]</span>{" "}
      <span className="text-emerald-300">{detection.title}</span>{" "}
      <span className="text-emerald-500/90">| Confidence: {detection.confidence}%</span>{" "}
      <span className="text-emerald-400/80">| {detection.type}</span>{" "}
      <span className="text-emerald-600/80">| {time}</span>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 border border-emerald-900/40 rounded bg-black/40">
      <div className="text-[10px] md:text-xs tracking-widest text-emerald-500/80 mb-1">
        {label}
      </div>
      <div className="text-2xl md:text-3xl text-emerald-300">{value}</div>
    </div>
  )
}
