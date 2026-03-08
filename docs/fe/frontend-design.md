# 前端设计文档

## 技术栈

| 层级 | 选择 | 说明 |
|------|------|------|
| 框架 | Next.js 14 | App Router, React Server Components |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS | 原子化 CSS |
| 组件库 | shadcn/ui | 基于 Radix UI |
| 状态管理 | Zustand | 轻量级状态管理 |
| 编辑器 | react-markdown | Markdown 渲染 |

## 项目结构

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (admin)/         # 管理后台路由组
│   │   │   ├── admin-posts/
│   │   │   ├── dashboard/
│   │   │   └── layout.tsx
│   │   ├── (auth)/          # 认证路由组
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── posts/           # 公开文章页面
│   │   ├── page.tsx         # 首页
│   │   └── layout.tsx       # 根布局
│   ├── components/
│   │   ├── layout/          # 布局组件
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   └── ui/              # shadcn 组件
│   ├── lib/
│   │   ├── utils.ts         # 工具函数
│   │   └── api.ts           # API 封装
│   └── stores/
│       └── auth.ts          # 认证状态
├── public/                  # 静态资源
└── package.json
```

## 页面路由

| 路由 | 功能 | 认证 |
|------|------|------|
| `/` | 首页 - 文章列表 | 否 |
| `/posts` | 文章列表页 | 否 |
| `/posts/[slug]` | 文章详情页 | 否 |
| `/login` | 登录页 | 否 |
| `/register` | 注册页 | 否 |
| `/dashboard` | 管理仪表盘 | 是 |
| `/admin-posts` | 文章管理 | 是 |
| `/admin-posts/new` | 新建文章 | 是 |
| `/admin-posts/[id]/edit` | 编辑文章 | 是 |

## API 对接

### 基础配置
```typescript
const API_BASE = 'http://localhost:3001/api/v1';
```

### 接口列表

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 登录 | POST | /auth/login | 用户登录 |
| 注册 | POST | /auth/register | 用户注册 |
| 文章列表 | GET | /posts | 获取文章列表 |
| 文章详情 | GET | /posts/:id | 获取文章详情 |
| 创建文章 | POST | /posts | 创建新文章 |
| 更新文章 | PUT | /posts/:id | 更新文章 |
| 删除文章 | DELETE | /posts/:id | 删除文章 |
| 评论列表 | GET | /comments/post/:postId | 获取评论 |
| 发表评论 | POST | /comments | 发表评论 |

### 认证方式
```typescript
headers: {
  'Authorization': 'Bearer <access_token>'
}
```

## 状态管理

### 认证状态 (Zustand)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
```

## 启动方式

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000
