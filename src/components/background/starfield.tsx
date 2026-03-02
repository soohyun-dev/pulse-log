'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const STAR_COUNT = 56
const STAR_MIN_SIZE = 1
const STAR_MAX_SIZE = 2.5
const STAR_SPEED = 0.3
const MOUSE_RADIUS = 120
const MOUSE_PUSH_FORCE = 2

const NEBULA_COUNT = 2
const NEBULA_SPEED = 0.08

const MILKY_WAY_CORE_STARS = 3200
const MILKY_WAY_OUTER_STARS = 1280

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
  jitterX: number
  jitterY: number
  size: number
  baseOpacity: number
  twinkleOffset: number
  warm: number
}

interface MilkyWayConfig {
  startX: number
  startY: number
  endX: number
  endY: number
  bandAngle: number
  bandWidth: number
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
    let mwConfig: MilkyWayConfig
    let mwSide: 'left' | 'right'
    let sunIntensity: number // 0 = 없음, 0~1 = 밝기
    let shootingStars: ShootingStar[] = []
    let nextShootingStarTime = Date.now() + 2000 + Math.random() * 3000

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
      const isMobile = canvas!.width < 1024
      const count = isMobile ? Math.round(STAR_COUNT * 0.3) : STAR_COUNT
      stars = Array.from({ length: count }, () => ({
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

      // 은하수 반대쪽에만 성운 배치
      const nebulaSide = mwSide === 'left' ? 'right' : 'left'

      nebulae = Array.from({ length: NEBULA_COUNT }, () => {
        const color = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]
        const marginLeft = Math.max(contentLeft, 100)
        const marginRight = Math.max(w - contentRight, 100)
        const x = nebulaSide === 'left'
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
      const w = canvas!.width
      const h = canvas!.height

      // 랜덤 위치/방향: 콘텐츠 바깥 한쪽에 배치
      mwSide = Math.random() < 0.5 ? 'left' : 'right'
      const side = mwSide
      const contentLeft = (w - CONTENT_MAX_WIDTH) / 2
      const contentRight = contentLeft + CONTENT_MAX_WIDTH
      const centerX = side === 'left'
        ? contentLeft * 0.5
        : contentRight + (w - contentRight) * 0.5

      // 랜덤 각도 30~45° (방향 랜덤)
      const sign = Math.random() < 0.5 ? 1 : -1
      const angle = sign * (Math.PI / 6 + Math.random() * Math.PI / 12)
      const length = h * (0.3 + Math.random() * 0.2)

      // Y 위치 랜덤 (밴드가 화면 안에 들어오도록)
      const margin = length * 0.3
      const centerY = margin + Math.random() * (h - margin * 2)

      const startX = centerX - Math.sin(angle) * length / 2
      const startY = centerY - Math.cos(angle) * length / 2
      const endX = centerX + Math.sin(angle) * length / 2
      const endY = centerY + Math.cos(angle) * length / 2
      const bandWidth = 80 + Math.random() * 60

      // 태양: 40% 확률로 없음, 있으면 밝기 랜덤
      sunIntensity = Math.random() < 0.4 ? 0 : 0.3 + Math.random() * 0.7

      mwConfig = {
        startX, startY, endX, endY,
        bandAngle: Math.atan2(endY - startY, endX - startX) + Math.PI / 2,
        bandWidth,
      }

      const totalStars = MILKY_WAY_CORE_STARS + MILKY_WAY_OUTER_STARS
      milkyWayStars = Array.from({ length: totalStars }, (_, i) => {
        const isCore = i < MILKY_WAY_CORE_STARS
        // 가우시안-ish 분포: Box-Muller
        const u1 = Math.random() || 0.001
        const u2 = Math.random()
        const gaussSpread = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
        const spread = isCore
          ? gaussSpread * 0.4  // 코어: 중심에 밀집
          : gaussSpread * 1.2  // 외곽: 넓게 퍼짐

        return {
          offset: Math.random(),
          spread,
          jitterX: (Math.random() - 0.5) * 20,
          jitterY: (Math.random() - 0.5) * 20,
          size: isCore
            ? 0.15 + Math.random() * 0.6
            : 0.1 + Math.random() * 0.4,
          baseOpacity: isCore
            ? 0.15 + Math.random() * 0.35
            : 0.08 + Math.random() * 0.2,
          twinkleOffset: Math.random() * Math.PI * 2,
          warm: isCore ? Math.exp(-spread * spread * 4) : 0,
        }
      })
    }

    function drawMilkyWay(time: number) {
      const { startX, startY, endX, endY, bandAngle, bandWidth } = mwConfig

      // 1) 은은한 외곽 글로우
      const outerSteps = 30
      for (let i = 0; i < outerSteps; i++) {
        const t = i / outerSteps
        const cx = startX + (endX - startX) * t
        const cy = startY + (endY - startY) * t

        const outside = getOutsideFactor(cx)
        if (outside < 0.05) continue

        // 양 끝은 페이드아웃
        const edgeFade = Math.sin(t * Math.PI)
        const o = 0.025 * outside * edgeFade

        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, bandWidth * 2.5)
        grad.addColorStop(0, `rgba(100, 115, 170, ${o})`)
        grad.addColorStop(0.5, `rgba(80, 100, 150, ${o * 0.3})`)
        grad.addColorStop(1, 'rgba(80, 100, 150, 0)')

        ctx!.beginPath()
        ctx!.arc(cx, cy, bandWidth * 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }

      // 2) 따뜻한 코어 글로우 (중앙부만)
      const coreSteps = 20
      for (let i = 0; i < coreSteps; i++) {
        const t = 0.3 + (i / coreSteps) * 0.4 // 밴드 중앙 40%만
        const cx = startX + (endX - startX) * t
        const cy = startY + (endY - startY) * t

        const outside = getOutsideFactor(cx)
        if (outside < 0.05) continue

        const edgeFade = Math.sin((t - 0.3) / 0.4 * Math.PI)
        const o = 0.04 * outside * edgeFade

        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, bandWidth * 0.7)
        grad.addColorStop(0, `rgba(190, 170, 130, ${o})`)
        grad.addColorStop(0.4, `rgba(160, 145, 115, ${o * 0.4})`)
        grad.addColorStop(1, 'rgba(130, 125, 120, 0)')

        ctx!.beginPath()
        ctx!.arc(cx, cy, bandWidth * 0.7, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }

      // 3) 진한 태양 코어 (랜덤 밝기, 없을 때도 있음)
      const coreT = 0.5
      const coreCx = startX + (endX - startX) * coreT
      const coreCy = startY + (endY - startY) * coreT
      const coreOutside = getOutsideFactor(coreCx)
      if (coreOutside > 0.05 && sunIntensity > 0) {
        const coreRadius = bandWidth * 0.5
        const co = coreOutside * sunIntensity

        // 넓은 후광 (주황/금빛)
        const halo3 = ctx!.createRadialGradient(coreCx, coreCy, 0, coreCx, coreCy, coreRadius * 4)
        halo3.addColorStop(0, `rgba(255, 200, 100, ${0.08 * co})`)
        halo3.addColorStop(0.3, `rgba(255, 180, 80, ${0.04 * co})`)
        halo3.addColorStop(0.6, `rgba(200, 150, 80, ${0.015 * co})`)
        halo3.addColorStop(1, 'rgba(180, 140, 80, 0)')

        ctx!.beginPath()
        ctx!.arc(coreCx, coreCy, coreRadius * 4, 0, Math.PI * 2)
        ctx!.fillStyle = halo3
        ctx!.fill()

        // 중간 후광 (따뜻한 백색)
        const halo2 = ctx!.createRadialGradient(coreCx, coreCy, 0, coreCx, coreCy, coreRadius * 2)
        halo2.addColorStop(0, `rgba(255, 240, 200, ${0.2 * co})`)
        halo2.addColorStop(0.3, `rgba(255, 220, 160, ${0.1 * co})`)
        halo2.addColorStop(0.7, `rgba(255, 200, 120, ${0.03 * co})`)
        halo2.addColorStop(1, 'rgba(240, 180, 100, 0)')

        ctx!.beginPath()
        ctx!.arc(coreCx, coreCy, coreRadius * 2, 0, Math.PI * 2)
        ctx!.fillStyle = halo2
        ctx!.fill()

        // 밝은 코어
        const coreGrad = ctx!.createRadialGradient(coreCx, coreCy, 0, coreCx, coreCy, coreRadius)
        coreGrad.addColorStop(0, `rgba(255, 255, 245, ${0.5 * co})`)
        coreGrad.addColorStop(0.1, `rgba(255, 250, 230, ${0.35 * co})`)
        coreGrad.addColorStop(0.3, `rgba(255, 235, 190, ${0.15 * co})`)
        coreGrad.addColorStop(0.6, `rgba(255, 210, 150, ${0.06 * co})`)
        coreGrad.addColorStop(1, 'rgba(255, 200, 130, 0)')

        ctx!.beginPath()
        ctx!.arc(coreCx, coreCy, coreRadius, 0, Math.PI * 2)
        ctx!.fillStyle = coreGrad
        ctx!.fill()

        // 가장 밝은 점
        const dotGrad = ctx!.createRadialGradient(coreCx, coreCy, 0, coreCx, coreCy, coreRadius * 0.15)
        dotGrad.addColorStop(0, `rgba(255, 255, 255, ${0.7 * co})`)
        dotGrad.addColorStop(0.5, `rgba(255, 255, 240, ${0.3 * co})`)
        dotGrad.addColorStop(1, 'rgba(255, 250, 230, 0)')

        ctx!.beginPath()
        ctx!.arc(coreCx, coreCy, coreRadius * 0.15, 0, Math.PI * 2)
        ctx!.fillStyle = dotGrad
        ctx!.fill()
      }

      // 4) 별들 (가우시안 분포로 자연스럽게)
      for (const ms of milkyWayStars) {
        const t = ms.offset
        const cx = startX + (endX - startX) * t
        const cy = startY + (endY - startY) * t

        const spreadDist = ms.spread * bandWidth
        const x = cx + Math.cos(bandAngle) * spreadDist + ms.jitterX
        const y = cy + Math.sin(bandAngle) * spreadDist + ms.jitterY

        const outside = getOutsideFactor(x)
        if (outside < 0.05) continue

        // 양 끝 페이드
        const edgeFade = Math.sin(t * Math.PI)
        // 중심에서 멀수록 어두움
        const distFade = Math.exp(-ms.spread * ms.spread * 1.5)

        const twinkle = 0.7 + 0.3 * Math.sin(time * 0.008 * 60 + ms.twinkleOffset)
        const opacity = ms.baseOpacity * twinkle * distFade * edgeFade * outside

        const r = Math.round(180 + ms.warm * 50)
        const g = Math.round(185 + ms.warm * 25 - (1 - ms.warm) * 15)
        const b = Math.round(210 - ms.warm * 70)

        ctx!.beginPath()
        ctx!.arc(x, y, ms.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
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
      const dark = isDarkRef.current
      const starDim = dark ? 1 : 0.25 // 라이트 모드에서 별 은은하게

      if (dark) {
        drawMilkyWay(time)
        drawNebulae(time)
      }

      // 별
      for (const star of stars) {
        star.opacity =
          star.baseOpacity *
          (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset)) *
          starDim

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
    createMilkyWay()
    createNebulae()
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
