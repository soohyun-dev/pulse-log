'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TocEntry {
  title: string
  url: string
  items: TocEntry[]
}

interface TableOfContentsProps {
  toc: TocEntry[]
}

function TocItems({
  items,
  activeId,
  depth = 0,
}: {
  items: TocEntry[]
  activeId: string
  depth?: number
}) {
  return (
    <ul className={cn('space-y-1.5 text-sm', depth > 0 && 'pl-4')}>
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            className={cn(
              'block text-muted-foreground hover:text-foreground transition-colors',
              activeId === item.url.slice(1) && 'text-accent font-medium',
            )}
          >
            {item.title}
          </a>
          {item.items.length > 0 && (
            <TocItems items={item.items} activeId={activeId} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  )
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' },
    )

    const headings = document.querySelectorAll('h2, h3')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (toc.length === 0) return null

  return (
    <nav className="hidden xl:block sticky top-20 ml-8 w-56 shrink-0">
      <p className="mb-3 text-sm font-semibold">목차</p>
      <TocItems items={toc} activeId={activeId} />
    </nav>
  )
}
