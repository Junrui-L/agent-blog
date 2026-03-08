'use client'

import { useEffect, useState } from 'react'
import { tagsApi, type Tag } from '@/lib/api'

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', slug: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    const response = await tagsApi.list()
    if (response.data) {
      setTags(response.data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) return

    setSubmitting(true)
    const response = await tagsApi.create({
      name: formData.name.trim(),
      slug: formData.slug.trim(),
    })

    if (response.data) {
      setFormData({ name: '', slug: '' })
      loadTags()
    } else {
      alert(response.error || '创建失败')
    }
    setSubmitting(false)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  return (
    <div className="container py-12">
      <h1 className="mb-10">标签管理</h1>

      {/* 创建标签 */}
      <div className="apple-card mb-8">
        <h2 style={{ marginBottom: '20px' }}>创建标签</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 flex-wrap">
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                标签名称
              </label>
              <input
                type="text"
                className="apple-input"
                placeholder="例如：前端开发"
                value={formData.name}
                onChange={(e) => setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                })}
              />
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                Slug
              </label>
              <input
                type="text"
                className="apple-input"
                placeholder="例如：frontend"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting || !formData.name.trim() || !formData.slug.trim()}
              >
                {submitting ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 标签列表 */}
      <div className="apple-card">
        <h2 style={{ marginBottom: '20px' }}>全部标签 ({tags.length})</h2>
        
        {loading ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            加载中...
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
            暂无标签
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <div 
                key={tag.id} 
                className="p-4 rounded-xl"
                style={{ 
                  background: 'var(--muted)',
                  transition: 'all 0.25s ease',
                }}
              >
                <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '4px' }}>
                  {tag.name}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  /{tag.slug}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  {tag._count?.posts || 0} 篇文章
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}