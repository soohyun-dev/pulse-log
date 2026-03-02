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
}

const placeholderGradients = [
  'from-blue-400 to-purple-500',
  'from-emerald-400 to-cyan-500',
  'from-orange-400 to-pink-500',
  'from-violet-400 to-indigo-500',
  'from-rose-400 to-amber-500',
]

export function PostCard({ slug, title, description, date, tags, thumbnail, metadata }: PostCardProps) {
  const gradient = placeholderGradients[slug.length % placeholderGradients.length]

  return (
    <Link
      href={`/posts/${slug}`}
      className="group block overflow-hidden rounded-xl border border-transparent p-3 -m-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-accent/50 hover:bg-accent/5"
    >
      <div className="aspect-[16/10] overflow-hidden rounded-xl">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradient} opacity-80 transition-opacity duration-300 group-hover:opacity-100`} />
        )}
      </div>

      <div className="flex flex-col gap-1.5 pt-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        <h3 className="font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
      </div>
    </Link>
  )
}
