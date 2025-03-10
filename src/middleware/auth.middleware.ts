import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['user-id'] as string;
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      req.user = user ?? undefined;
    }
    next();
  }
}
