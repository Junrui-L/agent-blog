import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
    });

    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent || parent.postId !== dto.postId) {
        throw new NotFoundException('父评论不存在');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        postId: dto.postId,
        userId,
        parentId: dto.parentId,
        content: dto.content,
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    });

    await this.prisma.post.update({
      where: { id: dto.postId },
      data: { commentCount: { increment: 1 } },
    });

    return comment;
  }

  async findByPost(postId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId, status: 'VISIBLE' },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          replies: {
            include: {
              user: { select: { id: true, username: true, avatar: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({
        where: { postId, status: 'VISIBLE' },
      }),
    ]);

    return { comments, total, page, limit };
  }

  async update(userId: string, id: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('无权修改此评论');
    }

    return this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
    });
  }

  async remove(userId: string, id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('无权删除此评论');
    }

    await this.prisma.comment.delete({ where: { id } });

    await this.prisma.post.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 } },
    });

    return { message: '删除成功' };
  }
}