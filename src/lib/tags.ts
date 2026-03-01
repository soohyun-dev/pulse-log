import { getPublishedPosts } from './posts'

export function getAllTags(): Record<string, number> {
  const posts = getPublishedPosts()
  const tags: Record<string, number> = {}
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const normalized = tag.toLowerCase()
      tags[normalized] = (tags[normalized] || 0) + 1
    })
  })
  return tags
}

export function getTagSlugs(): string[] {
  return Object.keys(getAllTags())
}
