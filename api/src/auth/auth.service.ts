import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { supabase, supabaseAdmin } from '../supabase/supabase.client';

@Injectable()
export class AuthService {
  async signup(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  setAuthCookies(res: Response, session: any) {
    if (!session || !session.access_token || !session.refresh_token) return;

    res.cookie('access_token', session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res.cookie('refresh_token', session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  async refreshSession(refresh_token: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) throw new Error(`Refresh failed: ${error.message}`);
    return data;
  }

  async logout(access_token: string) {
    const { error } = await supabaseAdmin.auth.admin.signOut(
      access_token,
      'global',
    );

    if (error) {
      throw new Error(`Failed to logout: ${error.message}`);
    }
  }
}
