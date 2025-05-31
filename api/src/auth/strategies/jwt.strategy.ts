import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'src/config';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.supabase.jwtSecret,
    });
  }

  validate(payload: { sub: string }): any {
    return {
      sub: payload.sub,
    };
  }

  authenticate(req: Request): void {
    super.authenticate(req);
  }
}
