import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('未提供认证令牌');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET || 'access-secret',
      });
      request.user = { userId: payload.sub };
      return true;
    } catch {
      throw new UnauthorizedException('无效的令牌');
    }
  }
}