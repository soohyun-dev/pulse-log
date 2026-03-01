import { readFileSync, writeFileSync } from 'fs'

const siteUrl = 'https://yunsoohyun.github.io/pulse-log'

const { posts } = await import('../.velite/index.js')

const staticPages = ['', '/posts', '/tags', '/about']

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${path === '' ? '1.0' : '0.6'}</priority>
  </url>`,
  )
  .join('\n')}
${posts
  .filter((p) => !p.draft)
  .map(
    (post) => `  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${post.updated || post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

writeFileSync('out/sitemap.xml', sitemap)
console.log('sitemap.xml generated')
