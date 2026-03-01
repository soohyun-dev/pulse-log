import { HeroSection } from '@/components/hero/hero-section'
import { PostCard } from '@/components/posts/post-card'
import { getPublishedPosts } from '@/lib/posts'
import Link from 'next/link'

export default function HomePage() {
  const posts = getPublishedPosts()
  const recentPosts = posts.slice(0, 6)

  return (
    <div className="mx-auto max-w-3xl px-6">
      <HeroSection />

      <section className="pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">최근 글</h2>
          {posts.length > 6 && (
            <Link
              href="/posts"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              전체 보기 &rarr;
            </Link>
          )}
        </div>

        <div className="grid gap-4">
          {recentPosts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              metadata={post.metadata}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            아직 작성된 글이 없습니다.
          </p>
        )}
      </section>
    </div>
  )
}
