'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">标签管理</h1>

      {/* 创建标签 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>创建标签</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">标签名称</Label>
              <Input
                id="name"
                placeholder="例如：前端开发"
                value={formData.name}
                onChange={(e) => setFormData({
                  ...formData,
                  name: e.target.value,
                  slug: generateSlug(e.target.value),
                })}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="例如：frontend"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={submitting || !formData.name.trim() || !formData.slug.trim()}>
              {submitting ? '创建中...' : '创建'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 标签列表 */}
      <Card>
        <CardHeader>
          <CardTitle>全部标签 ({tags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">暂无标签</div>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{tag.name}</h3>
                    <p className="text-sm text-muted-foreground">/{tag.slug}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tag._count?.posts || 0} 篇文章
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