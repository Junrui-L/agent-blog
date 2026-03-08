'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { postsApi, tagsApi, type Post, type Tag } from '@/lib/api'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  })

  useEffect(() => {
    Promise.all([loadPost(), loadTags()])
  }, [postId])

  const loadPost = async () => {
    const response = await postsApi.get(postId)
    if (response.data) {
      const post = response.data
      setFormData({
        title: post.title,
        slug: post.slug,
        summary: post.summary || '',
        content: post.content,
        status: post.status,
      })
      setSelectedTags(post.tags?.map(t => t.id) || [])
    }
    setFetching(false)
  }

  const loadTags = async () => {
    const response = await tagsApi.list()
    if (response.data) {
      setTags(response.data)
    }
  }

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    setLoading(true)
    
    const response = await postsApi.update(postId, {
      ...formData,
      status,
      tagIds: selectedTags,
    })
    
    setLoading(false)
    
    if (response.data) {
      router.push('/dashboard')
    } else {
      alert(response.error || '更新失败')
    }
  }

  if (fetching) {
    return (
      <div className="container py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
        加载中...
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-10">
        <h1>编辑文章</h1>
        <div className="flex gap-3">
          <button 
            className="btn-secondary"
            onClick={() => handleSubmit('DRAFT')}
            disabled={loading}
          >
            保存草稿
          </button>
          <button 
            className="btn-primary"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={loading}
          >
            更新
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 基本信息 */}
        <div className="apple-card">
          <h2 style={{ marginBottom: '20px' }}>基本信息</h2>
          
          <div className="space-y-5">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                标题
              </label>
              <input
                type="text"
                className="apple-input"
                placeholder="文章标题"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Slug
              </label>
              <input
                type="text"
                className="apple-input"
                placeholder="article-url-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                摘要
              </label>
              <textarea
                className="apple-input"
                placeholder="文章摘要..."
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                标签 ({tags.length}) - 已选: {selectedTags.length}
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedTags(prev =>
                          prev.includes(tag.id)
                            ? prev.filter(id => id !== tag.id)
                            : [...prev, tag.id]
                        )
                      }}
                      className="apple-tag"
                      style={{ 
                        cursor: 'pointer',
                        background: isSelected ? 'var(--primary)' : 'var(--muted)',
                        color: isSelected ? 'white' : 'var(--foreground)',
                        border: 'none',
                      }}
                    >
                      {isSelected ? '✓ ' : ''}{tag.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="apple-card">
          <h2 style={{ marginBottom: '20px' }}>内容 (Markdown)</h2>
          <textarea
            className="apple-input"
            rows={20}
            style={{ fontFamily: 'monospace', resize: 'vertical' }}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}