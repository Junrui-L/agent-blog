'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { postsApi, type Post } from '@/lib/api'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const response = await postsApi.list(1, 6)
    if (response.data) {
      setPosts(response.data.posts)
    }
    setLoading(false)
  }

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          欢迎来到技术博客
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          分享前端开发、TypeScript、React、Next.js 等技术文章
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/posts">
            <Button>浏览文章</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">立即注册</Button>
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-6">最新文章</h2>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">加载中...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无文章，请先发布内容
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      {post.tags?.slice(0, 1).map((tag) => (
                        <span key={tag.id} className="px-2 py-1 bg-primary/10 rounded-md text-xs">
                          {tag.name}
                        </span>
                      ))}
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {post.summary || post.content.slice(0, 100)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}