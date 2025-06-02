import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { UserDto } from 'src/users/dto/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return null;

    const transformed = plainToInstance(UserDto, request.user, {
      excludeExtraneousValues: true,
    });

    return transformed;
  },
);
