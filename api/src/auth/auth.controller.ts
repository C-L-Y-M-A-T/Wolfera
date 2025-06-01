import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { SignupDto } from './dtos/signup.dto';
import { AccessToken } from './types/AccessToken';

interface AuthenticatedRequest extends Request {
  user:
    | {
        id: string;
        email: string;
        username: string;
      }
    | any;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'john' },
        password: { type: 'string', example: 'changeme' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    type: AccessToken,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Req() req: AuthenticatedRequest): AccessToken {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AccessToken,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(@Body() signupDto: SignupDto): Promise<AccessToken> {
    return await this.authService.signup(signupDto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Req() req: AuthenticatedRequest): string {
    // Implement logout logic if needed, e.g., invalidate the session or token
    return `User ${req.user.username} logged out successfully`;
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user): any {
    return user;
  }
}
