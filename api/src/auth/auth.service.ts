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
      if (error.code === 'user_already_exists') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 'weak_password') {
        throw new BadRequestException(error.message);
      }
      if (error.code === 'invalid_credentials') {
        throw new UnauthorizedException(error.message);
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
        throw new UnauthorizedException(error.message);
      }
      if (error.code == 'validation_failed') {
        throw new BadRequestException(error.message);
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
  async googleSignIn(token: string) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token,
    });
    if (error) {
      console.error('Google sign-in error:', error);
      throw new BadRequestException(error.message);
    }
    return data;
  }
}
