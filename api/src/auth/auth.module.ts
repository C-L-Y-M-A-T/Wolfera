import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'src/config';
import { UserModule } from 'src/users/user.module';

import { JwtAuthGuard } from './guards/supabase-auth.guard';
import { SupabaseStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [],
  providers: [JwtAuthGuard, SupabaseStrategy],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: config.supabase.jwtSecret,
      signOptions: { expiresIn: 3600 },
    }),
  ],
})
export class AuthModule {}
