'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    <div className="container py-12">
      <div className="flex items-center justify-between mb-10">
        <h1>文章管理</h1>
        <Link href="/admin-posts/new">
          <button className="btn-primary">写文章</button>
        </Link>
      </div>

      <div className="apple-card">
        <h2 style={{ marginBottom: '20px' }}>全部文章 ({posts.length})</h2>
        
        {loading ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            加载中...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            暂无文章，
            <Link href="/admin-posts/new" style={{ color: 'var(--primary)' }}>写第一篇</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="flex items-center justify-between p-5 rounded-xl"
                style={{ 
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 style={{ fontSize: '17px', fontWeight: 600 }}>{post.title}</h3>
                    <span 
                      className="apple-tag"
                      style={{ 
                        background: post.status === 'PUBLISHED' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 149, 0, 0.15)',
                        color: post.status === 'PUBLISHED' ? '#34c759' : '#ff9500',
                      }}
                    >
                      {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                    {post.tags?.[0]?.name || '未分类'} · {new Date(post.createdAt).toLocaleDateString('zh-CN')} · /{post.slug}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/admin-posts/${post.id}/edit`}>
                    <button style={{ 
                      fontSize: '14px', 
                      color: 'var(--primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}>
                      编辑
                    </button>
                  </Link>
                  <button 
                    style={{ 
                      fontSize: '14px', 
                      color: '#ff3b30',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDelete(post.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}