"use client"

import { useEffect, useRef } from "react"

type Props = {
  density?: number // 0.5 - 1.2 typical
}

/**
 * Matrix-style character rain canvas background.
 * Lightweight and runs only on the client, sized to parent.
 */
export function MatrixCanvas({ density = 1.0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const parentRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement as HTMLElement | null
    parentRef.current = parent || null

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let width = (parent?.clientWidth ?? window.innerWidth)
    let height = (parent?.clientHeight ?? window.innerHeight)
    let animationFrame = 0

    function resize() {
      width = (parent?.clientWidth ?? window.innerWidth)
      height = (parent?.clientHeight ?? window.innerHeight)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init()
    }

    const characters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$%#*+-/~"
    const fontSize = 14
    let columns = Math.floor(width / fontSize)
    let drops: number[] = []
    function init() {
      columns = Math.floor(width / fontSize)
      drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * height))
    }

    function draw() {
      // Faded overlay to produce trail
      ctx.fillStyle = "rgba(0, 20, 10, 0.08)"
      ctx.fillRect(0, 0, width, height)

      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace`

      for (let i = 0; i < columns * density; i++) {
        const column = Math.floor(i % columns)
        const x = column * fontSize
        const y = drops[column] * fontSize

        const char = characters.charAt(Math.floor(Math.random() * characters.length))
        const head = Math.random() < 0.03

        // glow core
        ctx.shadowColor = "rgba(0, 255, 156, 0.35)"
        ctx.shadowBlur = 8

        ctx.fillStyle = head ? "rgba(180,255,220,0.9)" : "rgba(0,255,156,0.65)"
        ctx.fillText(char, x, y)

        // reset
        ctx.shadowBlur = 0

        if (y > height && Math.random() > 0.975) {
          drops[column] = 0
        } else {
          drops[column]++
        }
      }

      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const ro = new ResizeObserver(resize)
    if (parent) ro.observe(parent)
    else ro.observe(document.body)

    return () => {
      cancelAnimationFrame(animationFrame)
      ro.disconnect()
    }
  }, [density])

  return <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
}
