import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const exists = await this.prisma.tag.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
    });

    if (exists) {
      throw new ConflictException('标签名或 slug 已存在');
    }

    return this.prisma.tag.create({ data: dto });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return tag;
  }

  async update(id: string, dto: UpdateTagDto) {
    await this.findOne(id);

    if (dto.name || dto.slug) {
      const exists = await this.prisma.tag.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { OR: [{ name: dto.name }, { slug: dto.slug }] },
          ],
        },
      });

      if (exists) {
        throw new ConflictException('标签名或 slug 已存在');
      }
    }

    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.tag.delete({ where: { id } });
    return { message: '删除成功' };
  }
}