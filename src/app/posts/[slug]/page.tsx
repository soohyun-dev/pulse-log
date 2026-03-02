import { notFound } from 'next/navigation'
import { posts } from '#site/content'
import { MDXContent } from '@/components/mdx/mdx-content'
import { TableOfContents } from '@/components/toc/table-of-contents'
import { GiscusComments } from '@/components/comments/giscus-comments'
import { TagBadge } from '@/components/tags/tag-badge'
import { getAdjacentPosts } from '@/lib/posts'
import { siteConfig } from '@/lib/constants'
import { BriefingIntro, BriefingFadeIn } from '@/components/posts/briefing-intro'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return posts
    .filter((p) => !p.draft)
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `${siteConfig.url}/posts/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

function formatMilitaryDate(date: string) {
  const d = new Date(date)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const day = String(d.getDate()).padStart(2, '0')
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = posts.find((p) => p.slug === slug && !p.draft)

  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)

  return (
    <BriefingIntro fileId={slug.toUpperCase().replace(/-/g, '_')}>
      <div className="mx-auto max-w-[70rem] px-6 py-12">
        <div className="flex gap-0 xl:gap-0">
          <article className="flex-1 min-w-0">
            <header className="mb-8">
              {/* Military-style meta line */}
              <BriefingFadeIn delay={1400}>
                <div className="flex items-center gap-3 font-mono text-[0.65rem] tracking-wider uppercase text-neutral-500 mb-4">
                  <time dateTime={post.date}>{formatMilitaryDate(post.date)}</time>
                  <span className="text-neutral-700">|</span>
                  <span>{Math.ceil(post.metadata.readingTime)} min read</span>
                  <span className="text-neutral-700">|</span>
                  <span className="text-amber-500/50">Classified</span>
                </div>
              </BriefingFadeIn>

              {/* Title */}
              <BriefingFadeIn delay={1600}>
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              </BriefingFadeIn>

              {/* Tags */}
              {post.tags.length > 0 && (
                <BriefingFadeIn delay={1800}>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} clickable />
                    ))}
                  </div>
                </BriefingFadeIn>
              )}

              {/* Divider */}
              <BriefingFadeIn delay={1900}>
                <div className="briefing-divider mt-6" />
              </BriefingFadeIn>
            </header>

            {/* Content */}
            <BriefingFadeIn delay={2000}>
              <MDXContent code={post.body} />
            </BriefingFadeIn>

            <BriefingFadeIn delay={2100}>
              <nav className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/posts/${prev.slug}`}
                    className="group flex flex-col gap-1 rounded-lg border border-border p-4 hover:border-accent/50 transition-colors"
                  >
                    <span className="text-xs text-muted-foreground">&larr; 이전 글</span>
                    <span className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-1">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    href={`/posts/${next.slug}`}
                    className="group flex flex-col gap-1 rounded-lg border border-border p-4 hover:border-accent/50 transition-colors text-right"
                  >
                    <span className="text-xs text-muted-foreground">다음 글 &rarr;</span>
                    <span className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-1">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            </BriefingFadeIn>

            <BriefingFadeIn delay={2200}>
              <GiscusComments />
            </BriefingFadeIn>
          </article>

          <TableOfContents toc={post.toc} />
        </div>
      </div>
    </BriefingIntro>
  )
}
