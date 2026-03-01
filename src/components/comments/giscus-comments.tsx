'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { siteConfig } from '@/lib/constants'

export function GiscusComments() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <Giscus
        repo={siteConfig.giscus.repo}
        repoId={siteConfig.giscus.repoId}
        category={siteConfig.giscus.category}
        categoryId={siteConfig.giscus.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === 'dark' ? 'dark_dimmed' : 'light'}
        lang="ko"
        loading="lazy"
      />
    </div>
  )
}
