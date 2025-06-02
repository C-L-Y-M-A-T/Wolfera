// update-user.dto.ts
import { IsOptional, IsString } from 'class-validator';
import { IsAvatarConfig } from '../decorator/is-avatar-options.decorator';
import { AvatarConfigType } from '../types/AvatarOptions';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  email?: string;

  // @IsOptional()
  // @IsAvatarConfig()
  // avatarOptions?: Record<keyof AvatarConfigType, number>;
}
