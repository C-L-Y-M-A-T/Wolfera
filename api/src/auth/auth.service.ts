import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { supabase, supabaseAdmin } from '../supabase/supabase.client';

@Injectable()
export class AuthService {
  async signup(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      //fmma moshkla lenna
      // if (error && error.code === 'email_exists') {
      //   throw new ConflictException('Email is already registered');
      // }
      if (error.code === 'weak_password') {
        throw new BadRequestException('Password does not meet requirements');
      }
      console.error('Unexpected Supabase error:', error);
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.code === 'email_not_confirmed') {
        throw new ForbiddenException(
          'Please confirm your email before signing in',
        );
      }
      if (error.code === 'invalid_credentials') {
        throw new UnauthorizedException('Invalid email or password');
      }
      console.error('Unexpected Supabase error:', error);
      throw new BadRequestException(error.message);
    }
    return data;
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
