import { notFound } from 'next/navigation'
import { PostCard } from '@/components/posts/post-card'
import { getPostsByTag } from '@/lib/posts'
import { getTagSlugs } from '@/lib/tags'
import type { Metadata } from 'next'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export function generateStaticParams() {
  return getTagSlugs().map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `#${tag}`,
    description: `${tag} 태그의 글 목록`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  if (posts.length === 0) notFound()

  return (
    <div className="mx-auto max-w-[80rem] px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">#{tag}</h1>
      <p className="text-muted-foreground mb-8">{posts.length}개의 글</p>

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
