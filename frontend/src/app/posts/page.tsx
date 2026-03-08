'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { postsApi, type Post } from '@/lib/api'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const response = await postsApi.list(1, 20)
    if (response.data) {
      setPosts(response.data.posts)
    }
    setLoading(false)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">全部文章</h1>
      
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">加载中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          暂无文章
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
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
    </div>
  )
}