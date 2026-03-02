'use client'

import Link from 'next/link'
import { useState } from 'react'
import { siteConfig } from '@/lib/constants'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { MobileNav } from './mobile-nav'

const navItems = [
  { href: '/posts', label: 'Posts', darkLabel: 'Briefing' },
  { href: '/tags', label: 'Tags', darkLabel: 'Tags' },
  { href: '/about', label: 'About', darkLabel: 'About' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[70rem] items-center justify-between px-6">
        <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-3">
          <img
            src="/pulse-log/images/pulse_logo.png"
            alt={siteConfig.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="hidden dark:hidden sm:inline text-sm font-semibold">
            {siteConfig.name}
          </span>
          <span className="hidden sm:dark:inline font-mono text-[0.7rem] tracking-[0.2em] uppercase text-muted-foreground">
            Pulse Log
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <span key={item.href}>
              <Link
                href={item.href}
                className="dark:hidden text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
              <Link
                href={item.href}
                className="hidden dark:inline font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.darkLabel}
              </Link>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Light: original search */}
          <button
            onClick={() => {
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
            }}
            className="dark:hidden hidden md:flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
            aria-label="검색"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span>검색...</span>
            <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs font-mono">⌘K</kbd>
          </button>

          {/* Dark: military search */}
          <button
            onClick={() => {
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
            }}
            className="hidden md:dark:flex h-8 items-center gap-2 rounded-sm border border-border px-3 font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground hover:bg-muted transition-colors"
            aria-label="검색"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search</span>
            <kbd className="ml-1 rounded-sm bg-muted px-1.5 py-0.5 text-[0.6rem] font-mono">⌘K</kbd>
          </button>

          <ThemeToggle />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-md dark:rounded-sm border border-border hover:bg-muted transition-colors"
            aria-label="메뉴"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
