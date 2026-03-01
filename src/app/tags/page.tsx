import { TagBadge } from '@/components/tags/tag-badge'
import { getAllTags } from '@/lib/tags'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tags',
  description: '모든 태그 목록',
}

export default function TagsPage() {
  const tags = getAllTags()
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1])

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Tags</h1>
      <p className="text-muted-foreground mb-8">총 {sortedTags.length}개의 태그</p>

      <div className="flex flex-wrap gap-3">
        {sortedTags.map(([tag, count]) => (
          <TagBadge key={tag} tag={tag} count={count} clickable />
        ))}
      </div>

      {sortedTags.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          아직 태그가 없습니다.
        </p>
      )}
    </div>
  )
}
