# Agent Blog - 博客系统

基于多 Agent 协作开发的博客系统项目。

---

## 项目成员

| 角色 | Agent | 职责 |
|------|-------|------|
| PM | agent:pm | 产品管理、需求分析 |
| FE | agent:fe | 前端开发 |
| RD | agent:rd | 后端开发 |
| QA | agent:qa | 测试质量 |

---

## 前端架构 (FE)

### 技术栈

| 层级 | 选择 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 组件库 | shadcn/ui |
| 状态管理 | Zustand |
| 编辑器 | react-markdown + remark-gfm |

### 项目结构

```
blog/
├── src/
│   ├── app/
│   │   ├── (admin)/      # 管理后台路由组
│   │   │   ├── dashboard/
│   │   │   └── layout.tsx
│   │   ├── (auth)/       # 认证路由组
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (public)/     # 公开页面
│   │   │   └── posts/
│   │   ├── page.tsx      # 首页
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/           # shadcn 组件
│   ├── lib/
│   │   └── utils.ts
│   └── stores/
│       └── auth.ts       # 认证状态
├── public/
└── package.json
```

### 页面清单

| 路由 | 功能 | 状态 |
|------|------|------|
| `/` | 首页 - 文章列表 | ✅ |
| `/login` | 登录 | ✅ |
| `/register` | 注册 | ✅ |
| `/dashboard` | 管理仪表盘 | ✅ |
| `/posts/new` | 新建文章 | ✅ |
| `/posts/[id]/edit` | 编辑文章 | ✅ |

### 启动方式

```bash
cd blog
npm install
npm run dev
```

访问 http://localhost:3000

---

## 后端架构 (RD)

### 技术栈

| 层级 | 选择 |
|------|------|
| 语言 | Node.js (TypeScript) |
| 框架 | NestJS |
| 数据库 | PostgreSQL |
| ORM | Prisma |
| 缓存 | Redis (可选) |
| 认证 | JWT (双 Token) |

### 项目结构

```
blog-backend/
├── src/
│   ├── auth/             # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── posts/            # 文章模块
│   ├── comments/         # 评论模块
│   ├── tags/             # 标签模块
│   ├── prisma/           # Prisma 服务
│   │   └── prisma.service.ts
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma     # 数据库模型
├── dist/                 # 编译输出
└── package.json
```

### 数据库模型

```prisma
// 用户表
model User {
  id           String    @id @default(uuid())
  username     String    @unique
  email        String    @unique
  passwordHash String
  nickname     String?
  avatar       String?
  bio          String?
  role         Role      @default(USER)
  status       Status    @default(ACTIVE)
  posts        Post[]
  comments     Comment[]
  likes        Like[]
}

// 文章表
model Post {
  id           String     @id @default(uuid())
  authorId     String
  title        String
  slug         String     @unique
  summary      String?
  content      String
  coverImage   String?
  status       PostStatus @default(DRAFT)
  viewCount    Int        @default(0)
  likeCount    Int        @default(0)
  commentCount Int        @default(0)
  publishedAt  DateTime?
  author       User       @relation(fields: [authorId], references: [id])
  tags         PostTag[]
  comments     Comment[]
  likes        Like[]
}

// 评论表
model Comment {
  id        String   @id @default(uuid())
  postId    String
  userId    String
  parentId  String?
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
}

// 标签表
model Tag {
  id    String    @id @default(uuid())
  name  String    @unique
  slug  String    @unique
  posts PostTag[]
}
```

### API 规范

**Base URL:** `http://localhost:3001/api/v1`

**认证方式:** `Authorization: Bearer <access_token>`

#### 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /auth/register | 注册 |
| POST | /auth/login | 登录 |
| POST | /auth/refresh | 刷新 Token |

#### 文章接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /posts | 文章列表 | 否 |
| GET | /posts/:id | 文章详情 | 否 |
| POST | /posts | 创建文章 | 是 |
| PUT | /posts/:id | 更新文章 | 是 |
| DELETE | /posts/:id | 删除文章 | 是 |

#### 评论接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /comments/post/:postId | 文章评论 | 否 |
| POST | /comments | 发表评论 | 是 |

#### 标签接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /tags | 标签列表 | 否 |
| POST | /tags | 创建标签 | 是 |

### 启动方式

```bash
cd blog-backend
npm install

# 配置数据库
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog"

# 初始化数据库
npx prisma migrate dev
npx prisma generate

# 启动服务
npm run start:dev
```

API 服务运行在 http://localhost:3001

---

## 测试方案 (QA)

### 测试阶段

| 阶段 | 周期 | 内容 |
|------|------|------|
| Phase 1 | 2周 | 功能测试 |
| Phase 2 | 1周 | 集成测试 |
| Phase 3 | 1周 | 性能 + 安全测试 |

### 测试范围

#### P0 核心功能

- [ ] 用户注册/登录
- [ ] 文章 CRUD
- [ ] 评论功能
- [ ] 权限控制

#### P1 重要功能

- [ ] 标签管理
- [ ] 文章搜索
- [ ] 分页功能
- [ ] 图片上传

#### P2 优化功能

- [ ] 缓存性能
- [ ] SEO 优化
- [ ] 移动端适配

### 测试环境

```
前端: http://localhost:3000
后端: http://localhost:3001
数据库: PostgreSQL (测试库)
```

---

## 项目状态

| 阶段 | 状态 | 负责人 |
|------|------|--------|
| 需求分析 | ✅ 完成 | PM |
| 前端开发 | ✅ 完成 | FE |
| 后端开发 | ✅ 完成 | RD |
| 自测 | 🔄 进行中 | FE/RD |
| 测试 | ⏳ 等待 | QA |
| 部署 | ⏳ 待开始 | - |

---

## 协作流程

```
PM 出 PRD
    ↓
FE 架构设计 ←→ RD 架构设计
    ↓              ↓
FE 开发 ←API→ RD 开发
    ↓              ↓
FE 自测        RD 自测
    ↓              ↓
    └──────┬──────┘
           ↓
      QA 测试
           ↓
      上线部署
```

---

## 目录说明

```
agent-blog/
├── README.md           # 本文件
├── docs/               # 文档
│   ├── fe/             # 前端文档
│   ├── rd/             # 后端文档
│   └── qa/             # 测试文档
├── frontend/           # 前端代码
├── backend/            # 后端代码
└── tests/              # 测试用例
```

---

## 贡献者

- PM Agent - 产品规划
- FE Agent - 前端实现
- RD Agent - 后端实现
- QA Agent - 质量保障

---

*Generated by OpenClaw Agents* 🌸
