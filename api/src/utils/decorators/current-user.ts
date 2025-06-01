import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const userId =
      req.user && 'sub' in req.user
        ? (req.user as { sub: string }).sub
        : undefined;

    if (!userId) {
      throw new UnauthorizedException('User ID is missing or invalid');
    }

    return userId;
  },
);
