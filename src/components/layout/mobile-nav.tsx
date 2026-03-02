'use client'

import Link from 'next/link'

const navItems = [
  { href: '/posts', label: 'Posts', darkLabel: 'Briefing' },
  { href: '/tags', label: 'Tags', darkLabel: 'Tags' },
  { href: '/about', label: 'About', darkLabel: 'About' },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null

  return (
    <div className="md:hidden border-t border-border bg-background dark:bg-background/95 dark:backdrop-blur-sm">
      <nav className="flex flex-col px-6 py-4 gap-3">
        {navItems.map((item) => (
          <span key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className="dark:hidden text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
            <Link
              href={item.href}
              onClick={onClose}
              className="hidden dark:inline font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.darkLabel}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  )
}
