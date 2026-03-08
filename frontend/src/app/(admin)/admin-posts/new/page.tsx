'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { postsApi, tagsApi, type Tag } from '@/lib/api'

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    loadTags()
  }, [])

  const loadTags = async () => {
    const response = await tagsApi.list()
    if (response.data) {
      setTags(response.data)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    setLoading(true)
    
    const response = await postsApi.create({
      ...formData,
      status,
      tagIds: selectedTags,
    })
    
    setLoading(false)
    
    if (response.data) {
      router.push('/dashboard')
    } else {
      alert(response.error || '创建失败')
    }
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-10">
        <h1>写文章</h1>
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
            发布
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
                onChange={(e) => handleTitleChange(e.target.value)}
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
              {tags.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  暂无标签，请先{' '}
                  <Link href="/tags" style={{ color: 'var(--primary)' }}>
                    创建标签
                  </Link>
                </p>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="apple-card">
          <h2 style={{ marginBottom: '20px' }}>内容 (Markdown)</h2>
          <textarea
            className="apple-input"
            placeholder="# 标题

这里写 Markdown 内容..."
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