'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button className="h-9 w-9 rounded-md" aria-label="모드 전환">
        <span className="sr-only">모드 전환</span>
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex h-9 items-center gap-2 rounded-md border border-border px-2.5 hover:bg-muted transition-colors"
      aria-label={isDark ? 'Civilian 모드로 전환' : 'Operative 모드로 전환'}
      title={isDark ? 'Civilian 모드로 전환' : 'Operative 모드로 전환'}
    >
      {isDark ? (
        /* Operative: 크로스헤어 아이콘 (작전 모드) */
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="22" x2="18" y1="12" y2="12" />
          <line x1="6" x2="2" y1="12" y2="12" />
          <line x1="12" x2="12" y1="6" y2="2" />
          <line x1="12" x2="12" y1="22" y2="18" />
        </svg>
      ) : (
        /* Civilian: 사람 아이콘 (민간인 모드) */
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
      <span className="text-xs text-muted-foreground hidden sm:inline">
        {isDark ? 'Operative' : 'Civilian'}
      </span>
    </button>
  )
}
