'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    <div className="container py-12">
      <h1 className="mb-10">全部文章</h1>
      
      {loading ? (
        <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
          加载中...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
          暂无文章
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
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
    </div>
  )
}