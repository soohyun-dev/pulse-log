import Link from 'next/link'
import { TagBadge } from '@/components/tags/tag-badge'

interface PostCardProps {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  thumbnail?: string
  metadata: { readingTime: number }
  index?: number
}

function formatMilitaryDate(date: string) {
  const d = new Date(date)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const day = String(d.getDate()).padStart(2, '0')
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export function PostCard({ slug, title, description, date, tags, thumbnail, metadata, index = 0 }: PostCardProps) {
  return (
    <Link href={`/posts/${slug}`} className="briefing-card group block rounded-sm">
      {/* Thumbnail */}
      <div className="aspect-[16/9] overflow-hidden relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover opacity-80 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-all duration-500"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-200/50 to-neutral-300/50 dark:from-neutral-800/50 dark:to-neutral-900/80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 dark:from-black/70 via-transparent to-transparent" />

        {/* Date overlay on thumbnail */}
        <div className="absolute top-3 left-3 font-mono text-[0.6rem] tracking-widest text-black/30 dark:text-white/40 uppercase">
          {formatMilitaryDate(date)}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3.5 flex flex-col gap-2">
        {/* Title */}
        <h3 className="font-semibold leading-snug text-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 text-[0.9rem]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} briefing />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
