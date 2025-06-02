import { IsAlphanumeric, IsOptional, Length } from 'class-validator';
import { IsAvatarConfig } from '../decorator/is-avatar-options.decorator';
import { AvatarConfigType } from '../types/AvatarOptions';

export class UpdateUserDto {
  @IsOptional()
  @IsAlphanumeric()
  @Length(3, 20)
  username?: string;

  @IsOptional()
  @IsAvatarConfig({
    message: 'avatarOptions must have valid keys and number values',
  })
  avatarOptions?: Record<keyof AvatarConfigType, number>;
}
