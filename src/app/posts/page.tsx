import { PostCard } from '@/components/posts/post-card'
import { TagBadge } from '@/components/tags/tag-badge'
import { getPublishedPosts } from '@/lib/posts'
import { getAllTags } from '@/lib/tags'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Posts',
  description: '모든 블로그 글 목록',
}

export default function PostsPage() {
  const posts = getPublishedPosts()
  const tags = getAllTags()

  return (
    <div className="mx-auto max-w-[80rem] px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Posts</h1>
      <p className="text-muted-foreground mb-8">총 {posts.length}개의 글</p>

      {Object.keys(tags).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(tags)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => (
              <TagBadge key={tag} tag={tag} count={count} clickable />
            ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            description={post.description}
            date={post.date}
            tags={post.tags}
            thumbnail={post.thumbnail}
            metadata={post.metadata}
          />
        ))}
      </div>
    </div>
  )
}
