'use client'

import Link from 'next/link'

const navItems = [
  { href: '/posts', label: 'Briefing' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  if (!open) return null

  return (
    <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
      <nav className="flex flex-col px-6 py-4 gap-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
