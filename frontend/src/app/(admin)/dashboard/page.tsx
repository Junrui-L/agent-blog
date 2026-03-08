'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { postsApi, tagsApi, type Post, type Tag } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({ posts: 0, published: 0, tags: 0 })
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [postsRes, tagsRes] = await Promise.all([
      postsApi.list(1, 5),
      tagsApi.list(),
    ])

    if (postsRes.data) {
      setRecentPosts(postsRes.data.posts)
      setStats(prev => ({
        ...prev,
        posts: postsRes.data?.total ?? 0,
        published: postsRes.data?.posts.filter(p => p.status === 'PUBLISHED').length ?? 0,
      }))
    }

    if (tagsRes.data) {
      setStats(prev => ({ ...prev, tags: tagsRes.data?.length ?? 0 }))
    }

    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    const result = await postsApi.delete(id)
    if (result.data !== undefined) {
      loadData()
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <Link href="/admin-posts/new">
          <Button>写文章</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              文章总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.posts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已发布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              标签数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tags}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>最近文章</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">加载中...</div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              暂无文章，
              <Link href="/admin-posts/new" className="text-primary hover:underline">写第一篇</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs rounded-md ${
                      post.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                    </span>
                    <Link href={`/admin-posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm">编辑</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}