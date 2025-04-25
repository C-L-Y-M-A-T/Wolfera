import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, error } = await this.authService.signup(
      dto.email,
      dto.password,
    );

    if (error) throw error;

    this.authService.setAuthCookies(res, data.session);
    return { message: 'Signup successful' };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, error } = await this.authService.login(
      dto.email,
      dto.password,
    );

    if (error) throw error;

    this.authService.setAuthCookies(res, data.session);
    return { message: 'Login successful' };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies['refresh_token'];
    if (!refresh_token) throw new UnauthorizedException('No refresh token');

    const { session } = await this.authService.refreshSession(refresh_token);
    this.authService.setAuthCookies(res, session);

    return { message: 'Session refreshed' };
  }
}
