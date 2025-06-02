import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from 'src/auth/types/AccessTokenPayload';
import { config } from 'src/config';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class JwtSocket {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async authenticate(token: string): Promise<User> {
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: config.jwt.secret,
      });

      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
