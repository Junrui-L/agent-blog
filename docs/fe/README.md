# 前端开发文档

## 项目概述

博客系统前端，基于 Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui 开发。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 16.1.6 | React 框架，支持 SSR/SSG |
| React | 19.2.3 | UI 库 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 4.x | 原子化 CSS |
| shadcn/ui | base-nova | UI 组件库 |
| Zustand | - | 状态管理 |
| react-markdown | - | Markdown 渲染 |

## 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 认证相关页面
│   │   │   ├── login/          # 登录页
│   │   │   └── register/       # 注册页
│   │   ├── (admin)/            # 后台管理页面
│   │   │   ├── dashboard/      # 仪表盘
│   │   │   └── admin-posts/    # 文章管理
│   │   ├── posts/              # 公开文章页面
│   │   │   └── [id]/           # 文章详情
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── components/
│   │   ├── ui/                 # shadcn 组件
│   │   └── layout/             # 布局组件
│   ├── lib/
│   │   ├── api.ts              # API 客户端
│   │   └── utils.ts            # 工具函数
│   └── stores/
│       └── auth.ts             # 认证状态
├── package.json
└── tsconfig.json
```

## API 对接

### Base URL
```
http://localhost:4000/api/v1
```

### 认证接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/register | 注册 |
| POST | /auth/login | 登录 |
| POST | /auth/refresh | 刷新 Token |

### 文章接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /posts | 文章列表 |
| GET | /posts/:id | 文章详情 |
| POST | /posts | 创建文章 |
| PUT | /posts/:id | 更新文章 |
| DELETE | /posts/:id | 删除文章 |

### 标签接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /tags | 标签列表 |
| POST | /tags | 创建标签 |

### 评论接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /comments/post/:postId | 评论列表 |
| POST | /comments | 发表评论 |

## 页面路由

| 路由 | 说明 | 权限 |
|------|------|------|
| `/` | 首页 | 公开 |
| `/posts` | 文章列表 | 公开 |
| `/posts/:id` | 文章详情 | 公开 |
| `/login` | 登录 | 公开 |
| `/register` | 注册 | 公开 |
| `/dashboard` | 后台仪表盘 | 需登录 |
| `/admin-posts` | 文章管理 | 需登录 |
| `/admin-posts/new` | 创建文章 | 需登录 |
| `/admin-posts/:id/edit` | 编辑文章 | 需登录 |

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员（可删除所有文章） |
| testuser | test123456 | 普通用户 |
| abc | 123456 | 普通用户 |

## 功能清单

### 已完成 ✅
- [x] 用户注册/登录
- [x] 文章列表展示
- [x] 文章详情页
- [x] 后台仪表盘
- [x] 文章 CRUD
- [x] Markdown 编辑器
- [x] 标签管理
- [x] 评论功能
- [x] 权限控制
- [x] 管理员权限

### 待开发 🚧
- [ ] 图片上传
- [ ] 富文本编辑器（Milkdown/Novel）
- [ ] 代码高亮
- [ ] 文章搜索
- [ ] 用户个人中心
- [ ] 响应式优化

## 更新日志

### 2026-03-08
- 修复文章详情页路由参数 `[slug]` -> `[id]`
- 首页登录后隐藏注册按钮，显示「进入后台」
- 删除文章失败时显示错误提示
- 完成所有 API 联调
- 添加管理员权限支持