# 后端设计文档

## 技术栈

| 层级 | 选择 | 说明 |
|------|------|------|
| 框架 | NestJS | 企业级 Node.js 框架 |
| 语言 | TypeScript | 类型安全 |
| ORM | Prisma | 现代化数据库工具 |
| 数据库 | PostgreSQL | 关系型数据库 |
| 认证 | JWT | JSON Web Token |
| 缓存 | Redis | 可选，用于会话缓存 |

## 项目结构

```
backend/
├── src/
│   ├── auth/                # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   └── auth.dto.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── posts/               # 文章模块
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── posts.module.ts
│   │   └── dto/
│   │       └── post.dto.ts
│   ├── comments/            # 评论模块
│   ├── tags/                # 标签模块
│   ├── prisma/              # Prisma 服务
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts        # 根模块
│   └── main.ts              # 入口文件
├── prisma/
│   ├── schema.prisma        # 数据库模型
│   └── migrations/          # 数据库迁移
└── package.json
```

## 数据库设计

### 用户表 (User)
```prisma
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
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  posts    Post[]
  comments Comment[]
}
```

### 文章表 (Post)
```prisma
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
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  
  author   User      @relation(fields: [authorId], references: [id])
  comments Comment[]
  tags     PostTag[]
}
```

### 评论表 (Comment)
```prisma
model Comment {
  id        String   @id @default(uuid())
  postId    String
  userId    String
  parentId  String?
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  post   Post      @relation(fields: [postId], references: [id])
  user   User      @relation(fields: [userId], references: [id])
  parent Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies Comment[] @relation("CommentReplies")
}
```

## API 接口文档

### 基础信息
- Base URL: `http://localhost:3001/api/v1`
- 认证方式: Bearer Token

### 认证接口

#### 注册
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### 登录
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": { ... }
}
```

### 文章接口

#### 获取文章列表
```http
GET /posts?page=1&limit=20&status=PUBLISHED
```

#### 获取文章详情
```http
GET /posts/:id
```

#### 创建文章（需认证）
```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "slug": "string",
  "content": "string",
  "summary": "string?",
  "status": "DRAFT|PUBLISHED",
  "tagIds": ["uuid"]
}
```

## 部署说明

### 环境要求
- Node.js >= 18
- PostgreSQL >= 14

### 部署步骤

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 配置数据库连接

# 3. 数据库迁移
npx prisma migrate dev
npx prisma generate

# 4. 启动服务
npm run start:dev    # 开发模式
npm run start:prod   # 生产模式
```

### Docker 部署
```bash
docker-compose up -d
```
