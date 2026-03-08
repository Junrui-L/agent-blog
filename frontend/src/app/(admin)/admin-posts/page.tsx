import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const posts = [
  { id: '1', title: 'Next.js 14 入门指南', slug: 'getting-started-with-nextjs', status: 'published', category: '前端开发', date: '2026-03-08' },
  { id: '2', title: 'TypeScript 最佳实践', slug: 'typescript-best-practices', status: 'draft', category: 'TypeScript', date: '2026-03-07' },
  { id: '3', title: 'Tailwind CSS 技巧', slug: 'tailwind-css-tips', status: 'published', category: 'CSS', date: '2026-03-06' },
  { id: '4', title: 'React 19 新特性', slug: 'react-19-features', status: 'draft', category: 'React', date: '2026-03-05' },
  { id: '5', title: 'Zustand 状态管理', slug: 'zustand-state-management', status: 'published', category: '状态管理', date: '2026-03-04' },
]

export default function PostsListPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <Link href="/posts/new">
          <Button>写文章</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>全部文章</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{post.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-md ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>/{post.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">编辑</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}