'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { postsApi, type Post } from '@/lib/api'
import { useEffect, useState } from 'react'

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    const response = await postsApi.get(postId)
    if (response.data) {
      setPost(response.data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container py-8 text-center text-muted-foreground">
        加载中...
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-8 text-center text-muted-foreground">
        文章不存在
        <div className="mt-4">
          <Link href="/" className="text-primary hover:underline">返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="container py-8 max-w-3xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:underline">首页</Link>
          <span>/</span>
          <Link href="/posts" className="hover:underline">文章</Link>
          <span>/</span>
          <span>{post.title}</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {post.tags?.slice(0, 1).map((tag) => (
            <span key={tag.id} className="px-2 py-1 bg-primary/10 rounded-md">
              {tag.name}
            </span>
          ))}
          <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
        </div>
      </header>

      {/* Content */}
      <Card>
        <CardContent className="prose prose-neutral dark:prose-invert max-w-none py-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-8 flex items-center justify-between">
        <Link href="/" className="text-primary hover:underline">← 返回首页</Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">分享</Button>
          <Button variant="outline" size="sm">收藏</Button>
        </div>
      </footer>
    </article>
  )
}