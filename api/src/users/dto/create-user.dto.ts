import { IsAlphanumeric, IsEmail, IsString, Length } from 'class-validator';
import { AvatarConfigType } from '../types/AvatarOptions';
import { IsAvatarConfig } from '../decorators/is-avatar-options.decorators';

export class CreateUserDto {
  @IsString()
  id: string;
  @IsEmail()
  @Length(5, 255)
  email: string;
  @IsAlphanumeric()
  @Length(3, 20)
  username: string;
  @IsAvatarConfig({
    message: 'avatarOptions must have valid keys and number values',
  })
  avatarOptions: Record<keyof AvatarConfigType, number>;
}
