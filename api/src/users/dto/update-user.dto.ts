import { IsAlphanumeric, IsOptional, Length } from 'class-validator';
import { IsAvatarConfig } from '../decorators/is-avatar-options.decorators';
import { AvatarConfigType } from '../types/AvatarOptions';

export class UpdateUserDto {
  @IsOptional()
  @IsAlphanumeric()
  @Length(3, 20)
  username?: string;
  @IsAvatarConfig({
    message: 'avatarOptions must have valid keys and number values',
  })
  @IsOptional()
  avatarOptions?: Record<keyof AvatarConfigType, number>;
}
