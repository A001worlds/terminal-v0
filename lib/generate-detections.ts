export type Detection = {
  id: string
  platform:
    | "YouTube"
    | "TikTok"
    | "Reddit"
    | "SoundCloud"
    | "Instagram"
    | "Twitch"
    | "Twitter"
    | "Facebook"
  title: string
  confidence: number
  type: "AI Cover" | "Remix" | "Leak" | "Bootleg" | "Mashup" | "Upload"
  timestamp: string
  fresh?: boolean
}

const platforms: Detection["platform"][] = [
  "YouTube",
  "TikTok",
  "Reddit",
  "SoundCloud",
  "Instagram",
  "Twitch",
  "Twitter",
  "Facebook",
]

const types: Detection["type"][] = [
  "AI Cover",
  "Remix",
  "Leak",
  "Bootleg",
  "Mashup",
  "Upload",
]

const titles = [
  "Midnight City (AI Cover)",
  "Viva La Vida Remix",
  "Leaked: Starboy Session",
  "Stay Bootleg",
  "Neon Dreams Mashup",
  "Eclipse (AI Cover)",
  "Night Runner Remix",
  "Leaked: After Hours",
  "Ghostwire Bootleg",
  "Skyfall AI Cover",
  "Moonlight Mashup",
  "Retro Wave Remix",
  "Gravity (AI Cover)",
  "Hidden Tape Leak",
  "Midnight Bootleg",
]

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateRandomDetections(): Detection[] {
  const count = rand(3, 5)
  const now = Date.now()
  const items: Detection[] = []

  for (let i = 0; i < count; i++) {
    const platform = pick(platforms)
    const type = pick(types)
    const baseTitle = pick(titles)
    const confidence = rand(55, 99)
    const ts = new Date(now - rand(0, 3000)).toISOString()

    items.push({
      id: `${platform}-${ts}-${Math.random().toString(16).slice(2, 8)}`,
      platform,
      title: baseTitle,
      confidence,
      type,
      timestamp: ts,
      fresh: true,
    })
  }
  // Return newest first to prepend neatly
  return items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
}
