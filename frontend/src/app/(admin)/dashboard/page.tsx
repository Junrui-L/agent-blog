'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { postsApi, tagsApi, type Post } from '@/lib/api'

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
    if (result.error) {
      alert('删除失败: ' + result.error)
    } else {
      loadData()
    }
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-12">
        <h1>仪表盘</h1>
        <div className="flex gap-3">
          <Link href="/tags">
            <button className="btn-secondary">标签管理</button>
          </Link>
          <Link href="/admin-posts/new">
            <button className="btn-primary">写文章</button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {[
          { label: '文章总数', value: stats.posts },
          { label: '已发布', value: stats.published },
          { label: '标签数', value: stats.tags },
        ].map((stat) => (
          <div key={stat.label} className="apple-card text-center">
            <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', marginBottom: '8px' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-0.02em' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="apple-card">
        <h2 style={{ marginBottom: '20px' }}>最近文章</h2>
        
        {loading ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            加载中...
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            暂无文章，
            <Link href="/admin-posts/new" style={{ color: 'var(--primary)' }}>写第一篇</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div 
                key={post.id} 
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ 
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div className="flex-1">
                  <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '4px' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span 
                    className="apple-tag"
                    style={{ 
                      background: post.status === 'PUBLISHED' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 149, 0, 0.15)',
                      color: post.status === 'PUBLISHED' ? '#34c759' : '#ff9500',
                    }}
                  >
                    {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                  </span>
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