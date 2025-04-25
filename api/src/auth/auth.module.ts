import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [SupabaseModule, PassportModule],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
