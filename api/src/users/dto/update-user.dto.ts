// update-user.dto.ts
import { IsObject, IsOptional, IsString } from 'class-validator';
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

  @IsOptional()
  @IsObject()
  avatarOptions?: Record<keyof AvatarConfigType, number>;
}
