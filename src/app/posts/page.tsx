import { PostCard } from '@/components/posts/post-card'
import { TagBadge } from '@/components/tags/tag-badge'
import { getPublishedPosts } from '@/lib/posts'
import { getAllTags } from '@/lib/tags'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Posts',
  description: '모든 블로그 글 목록',
}

function getMilitaryDate() {
  const now = new Date()
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const day = String(now.getDate()).padStart(2, '0')
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  const hours = String(now.getHours()).padStart(2, '0')
  const mins = String(now.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year} / ${hours}${mins} HRS`
}

export default function PostsPage() {
  const posts = getPublishedPosts()
  const tags = getAllTags()

  return (
    <div className="briefing-scanlines mx-auto max-w-[70rem] px-6 py-12">
      {/* Light: original header */}
      <div className="dark:hidden mb-8">
        <h1 className="text-3xl font-bold mb-2">Posts</h1>
        <p className="text-muted-foreground">총 {posts.length}개의 글</p>
      </div>

      {/* Dark: military header */}
      <div className="hidden dark:block mb-6">
        <p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground mb-1.5">
          Operation: Pulse Log
        </p>
        <h1 className="briefing-flicker font-mono text-2xl font-bold tracking-wider uppercase text-foreground">
          Mission Briefing
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 font-mono text-[0.65rem] tracking-wider text-muted-foreground">
          <span>{getMilitaryDate()}</span>
          <span className="opacity-30">|</span>
          <span>Files: {posts.length}</span>
          <span className="opacity-30">|</span>
          <span className="text-amber-600/60 dark:text-amber-500/50">Top Secret</span>
        </div>
      </div>

      {/* Light: tag filter */}
      {Object.keys(tags).length > 0 && (
        <div className="dark:hidden flex flex-wrap gap-2 mb-8">
          {Object.entries(tags)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => (
              <TagBadge key={tag} tag={tag} count={count} clickable />
            ))}
        </div>
      )}

      {/* Dark: divider */}
      <div className="hidden dark:block briefing-divider mb-6" />

      {/* Post Grid */}
      <div className="grid grid-cols-1 gap-8 dark:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            description={post.description}
            date={post.date}
            tags={post.tags}
            thumbnail={post.thumbnail}
            metadata={post.metadata}
            index={i}
          />
        ))}
      </div>

      {/* Dark: bottom decoration */}
      <div className="hidden dark:block mt-12">
        <div className="briefing-divider">
          <span>End of Briefing</span>
        </div>
      </div>
    </div>
  )
}
