// src/users/users.controller.ts

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { CurrentUser } from 'src/utils/decorators/current-user';
import { UsersService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async onCallback(
    @Req() req: Request,
    @Body()
    body: {
      email: string;
      username?: string;
      avatar_url?: string;
    },
  ) {
    const userId =
      req.user && 'sub' in req.user
        ? (req.user as { sub: string }).sub
        : undefined;
    if (!userId) {
      throw new Error('User ID is missing or invalid');
    }
    const user = await this.usersService.syncUser(userId, body);
    console.log('User synced', user);
    return { success: true };
  }

  @Get('me')
  getMe(@CurrentUser() userId: string) {
    return this.usersService.findById(userId);
  }
}
