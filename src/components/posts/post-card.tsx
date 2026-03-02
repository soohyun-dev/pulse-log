import Link from 'next/link'
import { formatDate } from '@/lib/utils'
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

const placeholderGradients = [
  'from-blue-400 to-purple-500',
  'from-emerald-400 to-cyan-500',
  'from-orange-400 to-pink-500',
  'from-violet-400 to-indigo-500',
  'from-rose-400 to-amber-500',
]

function formatMilitaryDate(date: string) {
  const d = new Date(date)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const day = String(d.getDate()).padStart(2, '0')
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export function PostCard({ slug, title, description, date, tags, thumbnail, metadata, index = 0 }: PostCardProps) {
  const gradient = placeholderGradients[slug.length % placeholderGradients.length]

  return (
    <Link
      href={`/posts/${slug}`}
      className="group block overflow-hidden rounded-xl dark:rounded-sm border border-transparent dark:border-0 p-3 dark:p-0 -m-3 dark:m-0 transition-all duration-300 ease-out hover:scale-[1.02] dark:hover:scale-100 hover:border-accent/50 dark:hover:border-transparent hover:bg-accent/5 dark:hover:bg-transparent dark:briefing-card"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/10] dark:aspect-[16/9] overflow-hidden rounded-xl dark:rounded-none relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 dark:group-hover:scale-100 dark:opacity-60 dark:group-hover:opacity-80"
          />
        ) : (
          <>
            {/* Light: colorful gradient */}
            <div className={`dark:hidden h-full w-full bg-gradient-to-br ${gradient} opacity-80 transition-opacity duration-300 group-hover:opacity-100`} />
            {/* Dark: subtle dark gradient */}
            <div className="hidden dark:block h-full w-full bg-gradient-to-br from-neutral-800/50 to-neutral-900/80" />
          </>
        )}

        {/* Dark only: overlay + date */}
        <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="hidden dark:block absolute top-3 left-3 font-mono text-[0.6rem] tracking-widest text-white/40 uppercase">
          {formatMilitaryDate(date)}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 pt-4 dark:px-4 dark:py-3.5 dark:gap-2">
        {/* Light: tags above title */}
        {tags.length > 0 && (
          <div className="dark:hidden flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold leading-snug group-hover:text-accent dark:group-hover:text-emerald-400 transition-colors line-clamp-2 dark:text-[0.9rem]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm dark:text-xs text-muted-foreground line-clamp-2 dark:leading-relaxed">
          {description}
        </p>

        {/* Light: date below */}
        <div className="dark:hidden flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <time dateTime={date}>{formatDate(date)}</time>
        </div>

        {/* Dark: briefing tags */}
        {tags.length > 0 && (
          <div className="hidden dark:flex flex-wrap items-center gap-1.5 mt-1">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} briefing />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
