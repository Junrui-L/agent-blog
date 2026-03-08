const API_BASE_URL = 'http://localhost:4000/api/v1'

interface ApiResponse<T> {
  data?: T
  error?: string
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('accessToken') 
    : null

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.message || '请求失败' }
    }

    return { data }
  } catch (error) {
    return { error: '网络错误' }
  }
}

// ========== 认证接口 ==========

export interface RegisterParams {
  username: string
  email: string
  password: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  register: (params: RegisterParams) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  login: (params: LoginParams) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  refresh: (refreshToken: string) =>
    request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
}

// ========== 文章接口 ==========

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  summary?: string
  status: 'DRAFT' | 'PUBLISHED'
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  limit: number
}

export interface CreatePostParams {
  title: string
  slug: string
  content: string
  summary?: string
  status: 'DRAFT' | 'PUBLISHED'
  tagIds: string[]
}

export const postsApi = {
  list: (page = 1, limit = 20, status = 'PUBLISHED') =>
    request<PostsResponse>(`/posts?page=${page}&limit=${limit}&status=${status}`),

  get: (id: string) =>
    request<Post>(`/posts/${id}`),

  create: (params: CreatePostParams) =>
    request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  update: (id: string, params: Partial<CreatePostParams>) =>
    request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(params),
    }),

  delete: (id: string) =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),
}

// ========== 评论接口 ==========

export interface Comment {
  id: string
  postId: string
  content: string
  parentId?: string
  author: {
    id: string
    username: string
  }
  createdAt: string
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  page: number
  limit: number
}

export interface CreateCommentParams {
  postId: string
  content: string
  parentId?: string
}

export const commentsApi = {
  list: (postId: string, page = 1, limit = 20) =>
    request<CommentsResponse>(`/comments/post/${postId}?page=${page}&limit=${limit}`),

  create: (params: CreateCommentParams) =>
    request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
}

// ========== 标签接口 ==========

export interface Tag {
  id: string
  name: string
  slug: string
  _count?: {
    posts: number
  }
}

export interface CreateTagParams {
  name: string
  slug: string
}

export const tagsApi = {
  list: () =>
    request<Tag[]>('/tags'),

  create: (params: CreateTagParams) =>
    request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
}