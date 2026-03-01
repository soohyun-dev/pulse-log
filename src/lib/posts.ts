import { posts } from '#site/content'

export function getPublishedPosts() {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug && !post.draft)
}

export function getPostsByTag(tag: string) {
  return getPublishedPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()),
  )
}

export function getFeaturedPosts(count = 3) {
  return getPublishedPosts().slice(0, count)
}

export function getAdjacentPosts(slug: string) {
  const allPosts = getPublishedPosts()
  const index = allPosts.findIndex((post) => post.slug === slug)
  return {
    prev: index < allPosts.length - 1 ? allPosts[index + 1] : null,
    next: index > 0 ? allPosts[index - 1] : null,
  }
}
