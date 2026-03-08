FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制代码
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 构建
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:prod"]