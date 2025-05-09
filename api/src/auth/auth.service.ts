import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabaseAdmin } from 'src/supabase/supabase.client';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(email: string, password: string) {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user!;
    return this.userService.syncFromSupabase(user);
  }

  async login(email: string, password: string) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;
    if (!user || !user.email_confirmed_at) {
      throw new UnauthorizedException(
        'Please confirm your email before logging in.',
      );
    }

    return {
      access_token: data.session?.access_token,
      user: await this.userService.syncFromSupabase(data.user),
    };
  }

  async syncUserFromToken(accessToken: string) {
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !data) throw error;
    const user = data.user;
    return this.userService.syncFromSupabase(user);
  }
}
