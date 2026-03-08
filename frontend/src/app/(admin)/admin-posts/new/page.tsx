'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
    console.log('Tags loaded:', response)
    if (response.data) {
      setTags(response.data)
    } else {
      console.error('Failed to load tags:', response.error)
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
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">写文章</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit('DRAFT')}
            disabled={loading}
          >
            保存草稿
          </Button>
          <Button 
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={loading}
          >
            发布
          </Button>
        </div>
      </div>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                placeholder="文章标题"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="article-url-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">摘要</Label>
              <Textarea
                id="summary"
                placeholder="文章摘要..."
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>标签 ({tags.length}) - 已选: {selectedTags.length}</Label>
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  暂无标签，请先{' '}
                  <Link href="/tags" className="text-primary hover:underline">
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
                          console.log('Tag clicked:', tag.name, 'isSelected:', isSelected)
                          setSelectedTags(prev =>
                            prev.includes(tag.id)
                              ? prev.filter(id => id !== tag.id)
                              : [...prev, tag.id]
                          )
                        }}
                        className={`px-3 py-1.5 text-sm rounded-md border-2 transition-all ${
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500 font-medium'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{tag.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>内容 (Markdown)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="# 标题

这里写 Markdown 内容..."
              rows={20}
              className="font-mono"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </CardContent>
        </Card>
      </form>
    </div>
  )
}