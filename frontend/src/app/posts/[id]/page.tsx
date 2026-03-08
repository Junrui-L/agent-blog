'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { postsApi, commentsApi, type Post, type Comment } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { useEffect, useState } from 'react'

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const { isAuthenticated } = useAuthStore()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadPost()
    loadComments()
  }, [postId])

  const loadPost = async () => {
    const response = await postsApi.get(postId)
    if (response.data) {
      setPost(response.data)
    }
    setLoading(false)
  }

  const loadComments = async () => {
    const response = await commentsApi.list(postId)
    if (response.data) {
      setComments(response.data.comments)
    }
  }

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return
    
    setSubmitting(true)
    const response = await commentsApi.create({
      postId,
      content: commentContent.trim(),
    })
    
    if (response.data) {
      setCommentContent('')
      loadComments()
    } else {
      alert(response.error || '发表评论失败')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="container py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
        加载中...
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
        文章不存在
        <div className="mt-4">
          <Link href="/" style={{ color: 'var(--primary)' }}>返回首页</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="container py-12">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-6" style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
          <Link href="/" style={{ color: 'var(--muted-foreground)' }}>首页</Link>
          <span>/</span>
          <Link href="/posts" style={{ color: 'var(--muted-foreground)' }}>文章</Link>
          <span>/</span>
          <span>{post.title}</span>
        </div>
        
        <h1 className="mb-4">{post.title}</h1>
        
        <div className="flex items-center gap-4" style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
          {post.tags?.slice(0, 1).map((tag) => (
            <span key={`tag-${post.id}-${tag.id}`} className="apple-tag" style={{ fontSize: '12px' }}>
              {tag.name}
            </span>
          ))}
          <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
          <span>·</span>
          <span>作者：{post.author?.username || '未知'}</span>
        </div>
      </header>

      {/* Content */}
      <div className="apple-card mb-10">
        <div style={{ 
          fontSize: '17px', 
          lineHeight: 1.7,
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Comments */}
      <div className="apple-card">
        <h2 style={{ marginBottom: '20px' }}>评论 ({comments.length})</h2>
        
        {/* Comment Form */}
        {isAuthenticated ? (
          <div className="mb-6">
            <textarea
              className="apple-input"
              placeholder="写下你的评论..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
            <button 
              className="btn-primary mt-3"
              onClick={handleSubmitComment} 
              disabled={submitting || !commentContent.trim()}
            >
              {submitting ? '发表中...' : '发表评论'}
            </button>
          </div>
        ) : (
          <p className="text-center py-4" style={{ color: 'var(--muted-foreground)' }}>
            <Link href="/login" style={{ color: 'var(--primary)' }}>登录</Link>
            {' '}后发表评论
          </p>
        )}

        {/* Comments List */}
        <div className="space-y-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          {comments.length === 0 ? (
            <p className="text-center py-4" style={{ color: 'var(--muted-foreground)' }}>暂无评论</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontWeight: 600 }}>{comment.user?.username || '匿名用户'}</span>
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                    {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <p style={{ fontSize: '15px' }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 flex items-center justify-between">
        <Link href="/" style={{ color: 'var(--primary)', fontSize: '14px' }}>← 返回首页</Link>
        <div className="flex gap-3">
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>分享</button>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>收藏</button>
        </div>
      </footer>
    </article>
  )
}