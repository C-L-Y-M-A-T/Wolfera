import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dtos/email-login.dto';
import { EmailSignupDto } from './dtos/email-signup.dto';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: EmailSignupDto) {
    return this.authService.signup(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: EmailLoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('sync-user')
  @UseGuards(SupabaseAuthGuard)
  syncUser(@Req() req) {
    return this.authService.syncUserFromToken(
      req.headers.authorization.split(' ')[1],
    );
  }
}
