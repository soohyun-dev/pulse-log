'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface BriefingIntroProps {
  fileId: string
  children: React.ReactNode
}

export function BriefingIntro({ fileId, children }: BriefingIntroProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState(0)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!mounted) return

    if (!isDark) {
      setPhase(4)
      return
    }

    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [mounted, isDark])

  // Not mounted yet: hide everything to prevent flash
  if (!mounted) {
    return <div style={{ opacity: 0 }}>{children}</div>
  }

  // Civilian mode: render children immediately
  if (!isDark) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Overlay */}
      {phase < 4 && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-500"
          style={{ opacity: phase >= 3 ? 0 : 1, pointerEvents: phase >= 3 ? 'none' : 'auto' }}
        >
          {/* Scan line sweep */}
          {phase >= 1 && phase < 3 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="briefing-scan-sweep" />
            </div>
          )}

          {/* Center content */}
          <div className="flex flex-col items-center gap-4 font-mono">
            <div className="text-[0.6rem] tracking-[0.4em] uppercase text-neutral-600">
              File: {fileId}
            </div>

            <div className="h-6 flex items-center">
              {phase === 0 && (
                <span className="text-sm tracking-[0.2em] uppercase text-amber-400/80 animate-pulse">
                  Accessing Classified File...
                </span>
              )}
              {phase === 1 && (
                <span className="text-sm tracking-[0.2em] uppercase text-amber-400/80 animate-pulse">
                  Decrypting...
                </span>
              )}
              {phase >= 2 && (
                <span className="text-sm tracking-[0.2em] uppercase text-emerald-400 briefing-text-glow">
                  Access Granted
                </span>
              )}
            </div>

            <div className="w-48 h-[2px] bg-neutral-800 overflow-hidden rounded-full">
              <div
                className="h-full bg-amber-400/70 transition-all ease-out"
                style={{
                  width: phase === 0 ? '20%' : phase === 1 ? '65%' : '100%',
                  transitionDuration: phase === 0 ? '400ms' : phase === 1 ? '500ms' : '300ms',
                  backgroundColor: phase >= 2 ? 'rgb(52 211 153 / 0.7)' : undefined,
                }}
              />
            </div>

            <div className="absolute w-40 h-24 border border-neutral-800/50 pointer-events-none"
              style={{ top: 'calc(50% - 3rem)', left: 'calc(50% - 5rem)' }}
            >
              <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-amber-500/30" />
              <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-amber-500/30" />
              <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-amber-500/30" />
              <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-amber-500/30" />
            </div>
          </div>
        </div>
      )}

      {/* Content hidden until overlay fades */}
      <div
        className="transition-opacity duration-700"
        style={{ opacity: phase >= 3 ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  )
}

export function BriefingFadeIn({ delay, children, className = '' }: {
  delay: number
  children: React.ReactNode
  className?: string
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  useEffect(() => {
    if (!mounted) return
    if (!isDark) {
      setVisible(true)
      return
    }
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay, isDark, mounted])

  if (!mounted) {
    return <div className={className} style={{ opacity: 0 }}>{children}</div>
  }

  if (!isDark) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={`transition-all duration-500 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {children}
    </div>
  )
}
