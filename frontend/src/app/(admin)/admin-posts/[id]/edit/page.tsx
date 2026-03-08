'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
      <div className="container py-8 text-center text-muted-foreground">
        加载中...
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">编辑文章</h1>
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
            更新
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <Label>标签</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag.id)
                          ? prev.filter(id => id !== tag.id)
                          : [...prev, tag.id]
                      )
                    }}
                    className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>内容 (Markdown)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
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