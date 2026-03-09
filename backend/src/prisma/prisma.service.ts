import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/blog';
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.client = new PrismaClient({ adapter });
  }

  get user() {
    return this.client.user;
  }

  get post() {
    return this.client.post;
  }

  get tag() {
    return this.client.tag;
  }

  get comment() {
    return this.client.comment;
  }

  get like() {
    return this.client.like;
  }

  get postTag() {
    return this.client.postTag;
  }

  // 暴露原生查询方法
  $queryRaw<T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T> {
    return this.client.$queryRaw<T>(query, ...values);
  }

  $executeRaw(query: TemplateStringsArray, ...values: unknown[]): Promise<number> {
    return this.client.$executeRaw(query, ...values);
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}