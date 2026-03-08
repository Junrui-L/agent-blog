'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { postsApi, type Post } from '@/lib/api'

export default function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const response = await postsApi.list(1, 100)
    if (response.data) {
      setPosts(response.data.posts)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    const result = await postsApi.delete(id)
    if (result.error) {
      alert('删除失败: ' + result.error)
    } else {
      loadPosts()
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <Link href="/admin-posts/new">
          <Button>写文章</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>全部文章</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无文章，
              <Link href="/admin-posts/new" className="text-primary hover:underline">写第一篇</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium">{post.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-md ${
                        post.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.tags?.[0]?.name || '未分类'}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                      <span>•</span>
                      <span>/{post.slug}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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