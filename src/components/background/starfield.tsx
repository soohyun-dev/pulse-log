'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const STAR_COUNT = 80
const STAR_MIN_SIZE = 1
const STAR_MAX_SIZE = 2.5
const STAR_SPEED = 0.3
const MOUSE_RADIUS = 120
const MOUSE_PUSH_FORCE = 2

const NEBULA_COUNT = 4
const NEBULA_SPEED = 0.08

const MILKY_WAY_STAR_COUNT = 200

const SHOOTING_STAR_INTERVAL_MIN = 30000
const SHOOTING_STAR_INTERVAL_MAX = 60000

const CONTENT_MAX_WIDTH = 1280

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  vx: number
  vy: number
  baseOpacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

interface Nebula {
  x: number
  y: number
  radiusX: number
  radiusY: number
  rotation: number
  rotationSpeed: number
  vx: number
  vy: number
  color: [number, number, number]
  baseOpacity: number
  pulseSpeed: number
  pulseOffset: number
}

interface MilkyWayStar {
  offset: number
  spread: number
  size: number
  baseOpacity: number
  twinkleOffset: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  trail: { x: number; y: number }[]
}

const NEBULA_COLORS: [number, number, number][] = [
  [80, 120, 200],
  [140, 80, 180],
  [60, 140, 160],
  [160, 60, 140],
  [100, 80, 200],
  [60, 100, 180],
]

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const isDarkRef = useRef(resolvedTheme === 'dark')

  useEffect(() => {
    isDarkRef.current = resolvedTheme === 'dark'
  }, [resolvedTheme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let mouse = { x: -9999, y: -9999 }
    let stars: Star[] = []
    let nebulae: Nebula[] = []
    let milkyWayStars: MilkyWayStar[] = []
    let shootingStars: ShootingStar[] = []
    let nextShootingStarTime = Date.now() + 2000 + Math.random() * 3000

    // 콘텐츠 영역 바깥 정도 (0 = 콘텐츠 안쪽, 1 = 완전히 바깥)
    function getOutsideFactor(x: number): number {
      const w = canvas!.width
      if (w <= CONTENT_MAX_WIDTH) return 0

      const contentLeft = (w - CONTENT_MAX_WIDTH) / 2
      const contentRight = contentLeft + CONTENT_MAX_WIDTH
      const fade = 150

      if (x < contentLeft - fade) return 1
      if (x < contentLeft + fade) return 1 - (x - (contentLeft - fade)) / (fade * 2)
      if (x > contentRight + fade) return 1
      if (x > contentRight - fade) return (x - (contentRight - fade)) / (fade * 2)
      return 0
    }

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }

    function createStars() {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: STAR_MIN_SIZE + Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE),
        opacity: 0,
        baseOpacity: 0.3 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * STAR_SPEED,
        vy: (Math.random() - 0.5) * STAR_SPEED,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        twinkleOffset: Math.random() * Math.PI * 2,
      }))
    }

    function createNebulae() {
      const w = canvas!.width
      const h = canvas!.height
      const contentLeft = (w - CONTENT_MAX_WIDTH) / 2
      const contentRight = contentLeft + CONTENT_MAX_WIDTH

      nebulae = Array.from({ length: NEBULA_COUNT }, (_, i) => {
        const color = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]
        const onLeft = i % 2 === 0
        const marginLeft = Math.max(contentLeft, 100)
        const marginRight = Math.max(w - contentRight, 100)
        const x = onLeft
          ? Math.random() * marginLeft
          : contentRight + Math.random() * marginRight
        return {
          x,
          y: Math.random() * h,
          radiusX: 150 + Math.random() * 250,
          radiusY: 100 + Math.random() * 180,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.0003,
          vx: (Math.random() - 0.5) * NEBULA_SPEED,
          vy: (Math.random() - 0.5) * NEBULA_SPEED,
          color,
          baseOpacity: 0.08 + Math.random() * 0.07,
          pulseSpeed: 0.0005 + Math.random() * 0.001,
          pulseOffset: Math.random() * Math.PI * 2,
        }
      })
    }

    function createMilkyWay() {
      milkyWayStars = Array.from({ length: MILKY_WAY_STAR_COUNT }, () => ({
        offset: Math.random(),
        spread: (Math.random() - 0.5) * 2,
        size: 0.3 + Math.random() * 1.2,
        baseOpacity: 0.15 + Math.random() * 0.4,
        twinkleOffset: Math.random() * Math.PI * 2,
      }))
    }

    function drawMilkyWay(time: number) {
      const w = canvas!.width
      const h = canvas!.height

      // 대각선 밴드: 왼쪽 위 → 오른쪽 아래
      const startX = -w * 0.15
      const startY = -h * 0.15
      const endX = w * 1.15
      const endY = h * 1.15
      const bandWidth = 200

      // 은하수 글로우
      const steps = 40
      for (let i = 0; i < steps; i++) {
        const t = i / steps
        const cx = startX + (endX - startX) * t
        const cy = startY + (endY - startY) * t

        const outside = getOutsideFactor(cx)
        if (outside < 0.05) continue

        const glowOpacity = 0.04 * outside
        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, bandWidth)
        grad.addColorStop(0, `rgba(120, 140, 200, ${glowOpacity})`)
        grad.addColorStop(0.4, `rgba(100, 120, 180, ${glowOpacity * 0.5})`)
        grad.addColorStop(1, 'rgba(100, 120, 180, 0)')

        ctx!.beginPath()
        ctx!.arc(cx, cy, bandWidth, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }

      // 은하수 별들
      const bandAngle = Math.atan2(endY - startY, endX - startX) + Math.PI / 2
      for (const ms of milkyWayStars) {
        const t = ms.offset
        const cx = startX + (endX - startX) * t
        const cy = startY + (endY - startY) * t

        const spreadDist = ms.spread * bandWidth * 0.8
        const gaussFactor = Math.exp(-ms.spread * ms.spread * 2)

        const x = cx + Math.cos(bandAngle) * spreadDist
        const y = cy + Math.sin(bandAngle) * spreadDist

        const outside = getOutsideFactor(x)
        if (outside < 0.05) continue

        const twinkle = 0.6 + 0.4 * Math.sin(time * 0.008 * 60 + ms.twinkleOffset)
        const opacity = ms.baseOpacity * twinkle * gaussFactor * outside

        ctx!.beginPath()
        ctx!.arc(x, y, ms.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(200, 210, 240, ${opacity})`
        ctx!.fill()
      }
    }

    function drawNebulae(time: number) {
      for (const nebula of nebulae) {
        nebula.x += nebula.vx
        nebula.y += nebula.vy
        nebula.rotation += nebula.rotationSpeed

        const margin = Math.max(nebula.radiusX, nebula.radiusY) * 1.5
        if (nebula.x < -margin) nebula.x = canvas!.width + margin
        if (nebula.x > canvas!.width + margin) nebula.x = -margin
        if (nebula.y < -margin) nebula.y = canvas!.height + margin
        if (nebula.y > canvas!.height + margin) nebula.y = -margin

        const outside = getOutsideFactor(nebula.x)
        if (outside < 0.05) continue

        const pulse = 0.7 + 0.3 * Math.sin(time * nebula.pulseSpeed * 60 + nebula.pulseOffset)
        const opacity = nebula.baseOpacity * pulse * outside

        const [r, g, b] = nebula.color

        ctx!.save()
        ctx!.translate(nebula.x, nebula.y)
        ctx!.rotate(nebula.rotation)

        const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, nebula.radiusX)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 1.5})`)
        grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${opacity})`)
        grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${opacity * 0.4})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx!.fillStyle = grad
        ctx!.scale(1, nebula.radiusY / nebula.radiusX)
        ctx!.beginPath()
        ctx!.arc(0, 0, nebula.radiusX, 0, Math.PI * 2)
        ctx!.fill()

        ctx!.restore()
      }
    }

    function spawnShootingStar() {
      const w = canvas!.width
      const h = canvas!.height
      const speed = 10 + Math.random() * 8
      const edge = Math.floor(Math.random() * 4)

      let x: number, y: number, angle: number
      switch (edge) {
        case 0:
          x = Math.random() * w
          y = -10
          angle = Math.PI * 0.3 + Math.random() * Math.PI * 0.4
          break
        case 1:
          x = w + 10
          y = Math.random() * h * 0.6
          angle = Math.PI * 0.6 + Math.random() * Math.PI * 0.4
          break
        case 2:
          x = -10
          y = Math.random() * h * 0.6
          angle = -Math.PI * 0.15 + Math.random() * Math.PI * 0.3
          break
        default:
          x = Math.random() * w * 0.5 + w * 0.25
          y = -10
          angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.7
          break
      }

      shootingStars.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 50 + Math.random() * 40,
        size: 1.5 + Math.random() * 1.5,
        trail: [],
      })
    }

    function drawShootingStars() {
      const now = Date.now()
      if (now >= nextShootingStarTime) {
        spawnShootingStar()
        nextShootingStarTime = now + SHOOTING_STAR_INTERVAL_MIN + Math.random() * (SHOOTING_STAR_INTERVAL_MAX - SHOOTING_STAR_INTERVAL_MIN)
      }

      shootingStars = shootingStars.filter((s) => {
        s.trail.push({ x: s.x, y: s.y })
        if (s.trail.length > 30) s.trail.shift()

        s.x += s.vx
        s.y += s.vy
        s.life++

        const progress = s.life / s.maxLife
        const alpha = progress < 0.15
          ? progress / 0.15
          : 1 - (progress - 0.15) / 0.85

        for (let i = 0; i < s.trail.length; i++) {
          const t = i / s.trail.length
          const trailAlpha = t * alpha * 0.8
          const trailSize = s.size * t * 0.6

          ctx!.beginPath()
          ctx!.arc(s.trail[i].x, s.trail[i].y, trailSize, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(200, 220, 255, ${trailAlpha})`
          ctx!.fill()
        }

        const headGrad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4)
        headGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
        headGrad.addColorStop(0.3, `rgba(200, 220, 255, ${alpha * 0.5})`)
        headGrad.addColorStop(1, 'rgba(200, 220, 255, 0)')

        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2)
        ctx!.fillStyle = headGrad
        ctx!.fill()

        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()

        return s.life < s.maxLife
      })
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      const time = Date.now() * 0.001

      if (isDarkRef.current) {
        // 은하수 (가장 뒤)
        drawMilkyWay(time)

        // 성운
        drawNebulae(time)
      }

      // 별
      for (const star of stars) {
        star.opacity =
          star.baseOpacity *
          (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset))

        const dx = star.x - mouse.x
        const dy = star.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_PUSH_FORCE
          star.vx += (dx / dist) * force
          star.vy += (dy / dist) * force
        }

        star.vx *= 0.98
        star.vy *= 0.98

        const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy)
        if (speed < STAR_SPEED * 0.3) {
          star.vx += (Math.random() - 0.5) * 0.02
          star.vy += (Math.random() - 0.5) * 0.02
        }

        star.x += star.vx
        star.y += star.vy

        if (star.x < -10) star.x = canvas!.width + 10
        if (star.x > canvas!.width + 10) star.x = -10
        if (star.y < -10) star.y = canvas!.height + 10
        if (star.y > canvas!.height + 10) star.y = -10

        const gradient = ctx!.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        )
        gradient.addColorStop(0, `rgba(200, 220, 255, ${star.opacity})`)
        gradient.addColorStop(0.3, `rgba(180, 200, 255, ${star.opacity * 0.4})`)
        gradient.addColorStop(1, 'rgba(180, 200, 255, 0)')

        ctx!.beginPath()
        ctx!.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx!.fillStyle = gradient
        ctx!.fill()

        ctx!.beginPath()
        ctx!.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(240, 248, 255, ${star.opacity})`
        ctx!.fill()
      }

      // 별똥별 (가장 위)
      drawShootingStars()

      animationId = requestAnimationFrame(animate)
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function handleMouseLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    createStars()
    createNebulae()
    createMilkyWay()
    animate()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
