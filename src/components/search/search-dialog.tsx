'use client'

import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { posts } from '#site/content'

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const publishedPosts = posts.filter((p) => !p.draft)

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="검색"
      className="fixed inset-0 z-[100]"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-1/4 z-[101] w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-background shadow-2xl">
        <Command.Input
          placeholder="포스트 검색..."
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-72 overflow-y-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </Command.Empty>
          {publishedPosts.map((post) => (
            <Command.Item
              key={post.slug}
              value={`${post.title} ${post.description} ${post.tags.join(' ')}`}
              onSelect={() => {
                router.push(`/posts/${post.slug}`)
                setOpen(false)
              }}
              className="flex cursor-pointer flex-col gap-1 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-muted"
            >
              <span className="font-medium">{post.title}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {post.description}
              </span>
            </Command.Item>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  )
}
