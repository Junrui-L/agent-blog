# 博客系统后端 API

基于 NestJS + Prisma + PostgreSQL 的博客系统后端服务。

## 技术栈

- Node.js + TypeScript
- NestJS
- Prisma 7.x
- PostgreSQL
- JWT 认证

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 启动数据库
docker run -d --name blog-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=blog -p 5432:5432 postgres:15

# 运行迁移
npx prisma migrate dev

# 启动服务
npm run start:dev
```

## API 文档

### 基础信息

- **Base URL**: `http://localhost:4000/api/v1`
- **认证方式**: `Authorization: Bearer <access_token>`

### 认证接口

#### 注册
```
POST /auth/register
Body: { "username": "string", "email": "string", "password": "string" }
Response: { "accessToken": "xxx", "refreshToken": "xxx" }
```

#### 登录
```
POST /auth/login
Body: { "username": "string", "password": "string" }
Response: { "accessToken": "xxx", "refreshToken": "xxx" }
```

#### 刷新Token
```
POST /auth/refresh
Body: { "refreshToken": "xxx" }
Response: { "accessToken": "xxx", "refreshToken": "xxx" }
```

### 文章接口

#### 文章列表
```
GET /posts?page=1&limit=20&status=PUBLISHED
Response: { "posts": [], "total": 0, "page": 1, "limit": 20 }
```

#### 文章详情
```
GET /posts/:id
```

#### 创建文章 (需认证)
```
POST /posts
Headers: Authorization: Bearer <token>
Body: { 
  "title": "string", 
  "slug": "string", 
  "content": "string", 
  "summary": "string?", 
  "status": "DRAFT|PUBLISHED", 
  "tagIds": [] 
}
```

#### 更新文章 (需认证)
```
PUT /posts/:id
Headers: Authorization: Bearer <token>
```

#### 删除文章 (需认证)
```
DELETE /posts/:id
Headers: Authorization: Bearer <token>
```

### 评论接口

#### 文章评论列表
```
GET /comments/post/:postId?page=1&limit=20
```

#### 发表评论 (需认证)
```
POST /comments
Headers: Authorization: Bearer <token>
Body: { "postId": "uuid", "content": "string", "parentId": "uuid?" }
```

#### 更新评论 (需认证)
```
PUT /comments/:id
```

#### 删除评论 (需认证)
```
DELETE /comments/:id
```

### 标签接口

#### 标签列表
```
GET /tags
Response: [{ "id": "uuid", "name": "string", "slug": "string", "_count": { "posts": 0 } }]
```

#### 创建标签 (需认证)
```
POST /tags
Body: { "name": "string", "slug": "string" }
```

#### 更新标签 (需认证)
```
PUT /tags/:id
```

#### 删除标签 (需认证)
```
DELETE /tags/:id
```

## 权限系统

### 角色
- **ADMIN**: 管理员，可以删除/修改所有文章
- **USER**: 普通用户，只能删除/修改自己的文章

### JWT Token Payload
```json
{
  "sub": "用户ID",
  "role": "ADMIN|USER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | ADMIN |
| testuser | 123456 | USER |

## 数据模型

```
User (用户)
├── id: UUID
├── username: string
├── email: string
├── passwordHash: string
├── role: ADMIN | USER
└── status: ACTIVE | BANNED

Post (文章)
├── id: UUID
├── authorId: UUID
├── title: string
├── slug: string
├── content: string
├── status: DRAFT | PUBLISHED
└── viewCount, likeCount, commentCount

Comment (评论)
├── id: UUID
├── postId: UUID
├── userId: UUID
├── parentId: UUID?
└── content: string

Tag (标签)
├── id: UUID
├── name: string
└── slug: string
```

## 环境变量

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
```

## License

MIT