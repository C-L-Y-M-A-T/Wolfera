import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabaseAdmin } from 'src/supabase/supabase.client';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class JwtSocket {
  constructor(
    private userService: UsersService
  ) {}

  async authenticate(token: string) {
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      console.log('Supabase getUser response:', data, error); //TODO remove log
      if (error || !data?.user) {
        throw new UnauthorizedException('Token invalide');
      }

      return await this.userService.findById(data.user.id);
    } catch (error: any) {
      throw new UnauthorizedException(
        `Erreur lors de la vérification du token`,
      );
    }
  }
}
