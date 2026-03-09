import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { SearchPostsDto, SearchResultDto } from './dto/search.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        authorId,
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        content: dto.content,
        coverImage: dto.coverImage,
        status: dto.status || 'DRAFT',
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
        tags: dto.tagIds
          ? {
              create: dto.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });

    return post;
  }

  async findAll(page = 1, limit = 20, status?: 'DRAFT' | 'PUBLISHED') {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: status ? { status } : undefined,
        include: {
          author: { select: { id: true, username: true, avatar: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where: status ? { status } : undefined }),
    ]);

    return { posts, total, page, limit };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    // 增加阅读量
    await this.prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async update(userId: string, userRole: string, id: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    // 管理员可以修改所有文章，普通用户只能修改自己的文章
    if (userRole !== 'ADMIN' && post.authorId !== userId) {
      throw new ForbiddenException('无权修改此文章');
    }

    // 乐观锁检查：版本号不匹配则拒绝更新
    if (post.version !== dto.version) {
      throw new ConflictException('文章已被他人修改，请刷新后重试');
    }

    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        content: dto.content,
        coverImage: dto.coverImage,
        status: dto.status,
        publishedAt:
          dto.status === 'PUBLISHED' && post.status === 'DRAFT'
            ? new Date()
            : post.publishedAt,
        version: { increment: 1 }, // 版本号 +1
      },
      include: { tags: { include: { tag: true } } },
    });

    return updated;
  }

  async remove(userId: string, userRole: string, id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    // 管理员可以删除所有文章，普通用户只能删除自己的文章
    if (userRole !== 'ADMIN' && post.authorId !== userId) {
      throw new ForbiddenException('无权删除此文章');
    }

    await this.prisma.post.delete({ where: { id } });

    return { message: '删除成功' };
  }

  /**
   * 全文搜索文章
   * 使用 ILIKE 实现简单搜索（后续可升级为全文搜索）
   */
  async search(dto: SearchPostsDto): Promise<{ articles: SearchResultDto[]; total: number }> {
    const { q, limit = 10 } = dto;
    const keyword = q.trim();
    const searchPattern = `%${keyword}%`;

    // 使用 Prisma 查询进行搜索
    const posts = await this.prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
          { summary: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      include: {
        author: { select: { id: true, username: true } },
        tags: { include: { tag: true } },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.post.count({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
          { summary: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });

    // 构建结果，包含高亮
    const articles: SearchResultDto[] = posts.map((post) => {
      // 高亮关键词
      const highlightKeyword = (text: string) => {
        const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
      };

      return {
        id: post.id,
        title: post.title,
        excerpt: post.summary || post.content.slice(0, 200),
        tags: post.tags.map((pt) => ({ id: pt.tag.id, name: pt.tag.name })),
        author: post.author,
        publishedAt: post.publishedAt,
        highlight: {
          title: post.title.toLowerCase().includes(keyword.toLowerCase())
            ? [highlightKeyword(post.title)]
            : [],
          content: post.content.toLowerCase().includes(keyword.toLowerCase())
            ? [highlightKeyword(post.content.slice(0, 200))]
            : [],
        },
      };
    });

    return { articles, total };
  }
}