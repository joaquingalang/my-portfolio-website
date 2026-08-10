"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useReducedMotion } from "../hooks/useReducedMotion"

interface Icon {
  x: number
  y: number
  z: number
  scale: number
  opacity: number
  id: number
}

interface IconCloudProps {
  icons?: React.ReactNode[]
  images?: string[]
  /**
   * Maximum rendered edge in CSS pixels. The canvas shrinks below this to fit
   * a narrower container, so it never forces a horizontal scrollbar.
   */
  size?: number
}

/**
 * Internal coordinate space. Sphere radius, icon size and the perspective
 * constants below are all tuned against this number, so rendering at a
 * different physical size is done by scaling the whole context rather than by
 * changing any of them — which keeps the depth falloff identical at every size.
 */
const DESIGN_SIZE = 300
const ICON_PX = 40
/** Sprite oversampling, so the icons stay sharp when scaled past 1x. */
const SPRITE_SCALE = 2

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function getDpr(): number {
  if (typeof window === "undefined") return 1
  // Capped at 2 — beyond that the extra fill cost buys nothing visible.
  return Math.min(2, window.devicePixelRatio || 1)
}

export function IconCloud({ icons, images, size = DESIGN_SIZE }: IconCloudProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [iconPositions, setIconPositions] = useState<Icon[]>([])
  const [renderSize, setRenderSize] = useState(0)
  const prefersReduced = useReducedMotion()

  // Pointer/rotation state lives in refs, not state. As component state it
  // re-ran the render effect on every mousemove, tearing down and restarting
  // the animation loop dozens of times a second.
  const rotationRef = useRef({ x: 0, y: 0 })
  const mousePosRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef<{
    x: number
    y: number
    startX: number
    startY: number
    startTime: number
    duration: number
  } | null>(null)

  const animationFrameRef = useRef<number>(0)
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([])
  const imagesLoadedRef = useRef<boolean[]>([])

  /** CSS pixels per design unit. */
  const factor = renderSize / DESIGN_SIZE

  // Track the container so the sphere can fill the space it is given, capped at
  // `size`. The wrapper is full-width and the canvas never exceeds it, so this
  // cannot feed back into its own measurement. Layout effect, so a container
  // narrower than `size` is measured before the first paint rather than after.
  useLayoutEffect(() => {
    const element = wrapperRef.current
    if (!element) return

    const measure = () => {
      const available = element.clientWidth || size
      setRenderSize(Math.max(0, Math.min(size, available)))
    }

    measure()

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure)
      return () => window.removeEventListener("resize", measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [size])

  // Create icon sprites once when icons/images change. Deliberately independent
  // of `renderSize` — they are oversampled up front so resizing never refetches.
  useEffect(() => {
    if (!icons && !images) return

    const items = icons || images || []
    const spritePx = ICON_PX * SPRITE_SCALE * getDpr()
    imagesLoadedRef.current = new Array(items.length).fill(false)

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas")
      offscreen.width = spritePx
      offscreen.height = spritePx
      const offCtx = offscreen.getContext("2d")

      if (offCtx) {
        if (images) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.src = items[index] as string
          img.onload = () => {
            offCtx.clearRect(0, 0, spritePx, spritePx)

            offCtx.beginPath()
            offCtx.arc(spritePx / 2, spritePx / 2, spritePx / 2, 0, Math.PI * 2)
            offCtx.closePath()
            offCtx.clip()

            offCtx.drawImage(img, 0, 0, spritePx, spritePx)

            imagesLoadedRef.current[index] = true
          }
        } else {
          // Handle SVG icons. react-dom/server is imported on demand so the server
          // renderer is code-split out of the main bundle for the images-only path.
          import("react-dom/server").then(({ renderToString }) => {
            const svgString = renderToString(item as React.ReactElement)
            const img = new Image()
            img.src = "data:image/svg+xml;base64," + btoa(svgString)
            img.onload = () => {
              offCtx.clearRect(0, 0, spritePx, spritePx)
              offCtx.drawImage(img, 0, 0, spritePx, spritePx)
              imagesLoadedRef.current[index] = true
            }
          })
        }
      }
      return offscreen
    })

    iconCanvasesRef.current = newIconCanvases
  }, [icons, images])

  // Generate initial icon positions on a sphere
  useEffect(() => {
    const items = icons || images || []
    const newIcons: Icon[] = []
    const numIcons = items.length || 20

    // Fibonacci sphere parameters
    const offset = 2 / numIcons
    const increment = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * increment

      const x = Math.cos(phi) * r
      const z = Math.sin(phi) * r

      newIcons.push({
        x: x * 100,
        y: y * 100,
        z: z * 100,
        scale: 1,
        opacity: 1,
        id: i,
      })
    }
    setIconPositions(newIcons)
  }, [icons, images])

  // Drag is limited to mouse and pen. Claiming touch here would swallow vertical
  // swipes and trap the page scroll behind a decorative canvas.
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch" || !factor) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    // Back into design space before hit-testing against the sphere.
    const x = (e.clientX - rect.left) / factor
    const y = (e.clientY - rect.top) / factor

    for (const icon of iconPositions) {
      const cosX = Math.cos(rotationRef.current.x)
      const sinX = Math.sin(rotationRef.current.x)
      const cosY = Math.cos(rotationRef.current.y)
      const sinY = Math.sin(rotationRef.current.y)

      const rotatedX = icon.x * cosY - icon.z * sinY
      const rotatedZ = icon.x * sinY + icon.z * cosY
      const rotatedY = icon.y * cosX + rotatedZ * sinX

      const screenX = DESIGN_SIZE / 2 + rotatedX
      const screenY = DESIGN_SIZE / 2 + rotatedY

      const scale = (rotatedZ + 200) / 300
      const radius = (ICON_PX / 2) * scale
      const dx = x - screenX
      const dy = y - screenY

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(icon.y, Math.sqrt(icon.x * icon.x + icon.z * icon.z))
        const targetY = Math.atan2(icon.x, icon.z)

        const currentX = rotationRef.current.x
        const currentY = rotationRef.current.y
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
        )

        targetRotationRef.current = {
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          startTime: performance.now(),
          duration: Math.min(2000, Math.max(800, distance * 1000)),
        }
        return
      }
    }

    isDraggingRef.current = true
    lastMousePosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch" || !factor) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      mousePosRef.current = {
        x: (e.clientX - rect.left) / factor,
        y: (e.clientY - rect.top) / factor,
      }
    }

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x
      const deltaY = e.clientY - lastMousePosRef.current.y

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
  }

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || renderSize <= 0) return

    const dpr = getDpr()
    const scale = dpr * (renderSize / DESIGN_SIZE)
    canvas.width = Math.round(renderSize * dpr)
    canvas.height = Math.round(renderSize * dpr)

    const draw = (advance: boolean) => {
      // One transform carries both device pixel ratio and the design-space
      // scale, so every coordinate below stays in design units.
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.clearRect(0, 0, DESIGN_SIZE, DESIGN_SIZE)

      if (advance) {
        const centerX = DESIGN_SIZE / 2
        const centerY = DESIGN_SIZE / 2
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
        const dx = mousePosRef.current.x - centerX
        const dy = mousePosRef.current.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const speed = 0.003 + (distance / maxDistance) * 0.01

        const target = targetRotationRef.current
        if (target) {
          const elapsed = performance.now() - target.startTime
          const progress = Math.min(1, elapsed / target.duration)
          const easedProgress = easeOutCubic(progress)

          rotationRef.current = {
            x: target.startX + (target.x - target.startX) * easedProgress,
            y: target.startY + (target.y - target.startY) * easedProgress,
          }

          if (progress >= 1) targetRotationRef.current = null
        } else if (!isDraggingRef.current) {
          rotationRef.current = {
            x: rotationRef.current.x + (dy / DESIGN_SIZE) * speed,
            y: rotationRef.current.y + (dx / DESIGN_SIZE) * speed,
          }
        }
      }

      iconPositions.forEach((icon, index) => {
        const cosX = Math.cos(rotationRef.current.x)
        const sinX = Math.sin(rotationRef.current.x)
        const cosY = Math.cos(rotationRef.current.y)
        const sinY = Math.sin(rotationRef.current.y)

        const rotatedX = icon.x * cosY - icon.z * sinY
        const rotatedZ = icon.x * sinY + icon.z * cosY
        const rotatedY = icon.y * cosX + rotatedZ * sinX

        const iconScale = (rotatedZ + 200) / 300
        const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200))

        ctx.save()
        ctx.translate(DESIGN_SIZE / 2 + rotatedX, DESIGN_SIZE / 2 + rotatedY)
        ctx.scale(iconScale, iconScale)
        ctx.globalAlpha = opacity

        if (iconCanvasesRef.current[index] && imagesLoadedRef.current[index]) {
          ctx.drawImage(
            iconCanvasesRef.current[index],
            -ICON_PX / 2,
            -ICON_PX / 2,
            ICON_PX,
            ICON_PX
          )
        }

        ctx.restore()
      })
    }

    // Reduced motion: paint the sphere once and leave it there.
    if (prefersReduced) {
      let settled = 0
      const paintUntilLoaded = () => {
        draw(false)
        settled += 1
        // Sprites arrive asynchronously, so keep repainting briefly until they land.
        if (settled < 120) animationFrameRef.current = requestAnimationFrame(paintUntilLoaded)
      }
      paintUntilLoaded()
      return () => cancelAnimationFrame(animationFrameRef.current)
    }

    let running = false

    const animate = () => {
      draw(true)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const start = () => {
      if (running) return
      running = true
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(animationFrameRef.current)
    }

    // The loop used to spin for the life of the page. Now it only runs while the
    // canvas is actually on screen and the tab is in the foreground.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 }
    )
    observer.observe(canvas)

    const onVisibilityChange = () => (document.hidden ? stop() : undefined)
    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      stop()
    }
  }, [iconPositions, prefersReduced, renderSize])

  return (
    <div ref={wrapperRef} className="flex w-full justify-center md:justify-end">
      <canvas
        ref={canvasRef}
        style={{ width: renderSize || size, height: renderSize || size }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="max-w-full"
        aria-label="Rotating cloud of technology logos"
        role="img"
      />
    </div>
  )
}
