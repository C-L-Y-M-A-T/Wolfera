import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { supabaseAdmin } from 'src/supabase/supabase.client';
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
    const data = await this.authService.signup(dto.email, dto.password);
    this.authService.setAuthCookies(res, data.session);
    return { message: 'Signup successful' };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(dto.email, dto.password);
    this.authService.setAuthCookies(res, data.session);
    return { message: 'Login successful' };
  }

  @Post('callback')
  async callback(
    @Body('access_token') access_token: string,
    @Body('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!access_token || !refresh_token) {
      throw new BadRequestException('Missing tokens');
    }

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.getUser(access_token);
    if (userError || !userData.user) {
      throw new UnauthorizedException('Invalid access token');
    }

    this.authService.setAuthCookies(res, { access_token, refresh_token });
    return { message: 'Tokens validated & stored' };
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

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.cookies['access_token'];
    if (!accessToken) throw new UnauthorizedException('No access token found');

    await this.authService.logout(accessToken);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}
