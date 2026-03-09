import { Tag } from '@/lib/api'

export interface SearchResult {
  id: string
  title: string
  excerpt: string
  tags: { id: string; name: string }[]
  author: { id: string; username: string }
  publishedAt: string | null
  highlight: {
    title: string[]
    content: string[]
  }
}

export interface SearchResponse {
  articles: SearchResult[]
  total: number
}

export const searchApi = {
  search: async (query: string, limit = 10): Promise<SearchResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/posts/search?q=${encodeURIComponent(query)}&limit=${limit}`
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '搜索失败')
    }

    // 后端直接返回 { articles, total }
    return data
  },
}