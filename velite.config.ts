import { defineConfig, defineCollection, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/*.mdx',
  schema: s.object({
    title: s.string().max(120),
    slug: s.path().transform((path) => path.replace(/^posts\//, '')),
    description: s.string().max(300),
    date: s.isodate(),
    updated: s.isodate().optional(),
    tags: s.array(s.string()).default([]),
    thumbnail: s.string().optional(),
    draft: s.boolean().default(false),
    body: s.mdx(),
    metadata: s.metadata(),
    toc: s.toc(),
  }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, {
        theme: {
          dark: 'github-dark-dimmed',
          light: 'github-light',
        },
        keepBackground: false,
      }],
      [rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['anchor'],
        },
      }],
    ],
  },
})
