import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { supabaseAdmin } from 'src/supabase/supabase.client';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const token = authHeader.split(' ')[1];
    const { data: user, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) throw new UnauthorizedException('Invalid token');

    req.user = user;

    return true;
  }
}
