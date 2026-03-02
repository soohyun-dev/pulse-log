import { HeroSection } from '@/components/hero/hero-section'
import { PostCard } from '@/components/posts/post-card'
import { getPublishedPosts } from '@/lib/posts'
import Link from 'next/link'

export default function HomePage() {
  const posts = getPublishedPosts()
  const recentPosts = posts.slice(0, 6)

  return (
    <div className="briefing-scanlines mx-auto max-w-[70rem] px-6">
      <HeroSection />

      <div className="briefing-divider mb-8" />

      <section className="pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-foreground/80">
            Recent Intel
          </h2>
          {posts.length > 6 && (
            <Link
              href="/posts"
              className="font-mono text-[0.7rem] tracking-wider uppercase text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400/80 transition-colors"
            >
              View All &rarr;
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post, i) => (
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

        {posts.length === 0 && (
          <p className="text-center text-muted-foreground py-12 font-mono text-sm">
            No intel available.
          </p>
        )}
      </section>
    </div>
  )
}
