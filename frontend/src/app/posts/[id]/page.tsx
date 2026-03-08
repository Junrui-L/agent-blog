'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { postsApi, commentsApi, type Post, type Comment } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { useEffect, useState } from 'react'

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const { isAuthenticated, user } = useAuthStore()
  
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
          <span>•</span>
          <span>作者：{post.author?.username || '未知'}</span>
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

      {/* Comments Section */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>评论 ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comment Form */}
            {isAuthenticated ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="写下你的评论..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleSubmitComment} disabled={submitting || !commentContent.trim()}>
                  {submitting ? '发表中...' : '发表评论'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">登录</Link>
                {' '}后发表评论
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 pt-4 border-t">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">暂无评论</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{comment.user?.username || '匿名用户'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

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