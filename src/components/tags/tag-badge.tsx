import Link from 'next/link'

interface TagBadgeProps {
  tag: string
  count?: number
  clickable?: boolean
}

export function TagBadge({ tag, count, clickable = false }: TagBadgeProps) {
  const className = "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"

  if (clickable) {
    return (
      <Link href={`/tags/${tag.toLowerCase()}`} className={className}>
        #{tag}
        {count !== undefined && <span>({count})</span>}
      </Link>
    )
  }

  return (
    <span className={className}>
      #{tag}
      {count !== undefined && <span>({count})</span>}
    </span>
  )
}
