'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { postsApi, type Post } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuthStore()

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
    <div>
      {/* Hero Section - 苹果风格大标题 */}
      <section className="text-center py-20 md:py-32" style={{ background: 'linear-gradient(180deg, var(--muted) 0%, var(--background) 100%)' }}>
        <div className="container">
          <h1 className="mb-4" style={{ fontSize: 'clamp(40px, 8vw, 56px)', fontWeight: 600, letterSpacing: '-0.02em' }}>
            欢迎来到技术博客
          </h1>
          <p className="text-lg md:text-xl mb-8" style={{ color: 'var(--muted-foreground)', maxWidth: '600px', margin: '0 auto' }}>
            分享前端开发、TypeScript、React、Next.js 等技术文章
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/posts">
              <button className="btn-primary">浏览文章</button>
            </Link>
            {!isAuthenticated ? (
              <Link href="/register">
                <button className="btn-secondary">立即注册</button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <button className="btn-secondary">进入后台</button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="container py-16">
        <h2 className="mb-10">最新文章</h2>
        
        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
            加载中...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
            暂无文章，请先发布内容
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <article className="apple-card h-full cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    {post.tags?.slice(0, 1).map((tag) => (
                      <span key={`tag-${post.id}-${tag.id}`} className="apple-tag" style={{ fontSize: '12px', padding: '4px 10px' }}>
                        {tag.name}
                      </span>
                    ))}
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <h3 className="mb-2" style={{ fontSize: '20px' }}>{post.title}</h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '15px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.summary || post.content.slice(0, 120)}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}