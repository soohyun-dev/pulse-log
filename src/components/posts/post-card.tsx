import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { TagBadge } from '@/components/tags/tag-badge'

interface PostCardProps {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  metadata: { readingTime: number }
}

export function PostCard({ slug, title, description, date, tags, metadata }: PostCardProps) {
  return (
    <Link
      href={`/posts/${slug}`}
      className="group block rounded-lg border border-border p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={date}>{formatDate(date)}</time>
          <span>&middot;</span>
          <span>{Math.ceil(metadata.readingTime)}분</span>
        </div>

        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
