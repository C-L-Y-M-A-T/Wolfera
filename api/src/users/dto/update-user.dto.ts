import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
  ArrayUnique,
  IsArray,
} from 'class-validator';
import { IsAvatarConfig } from '../decorators/is-avatar-options.decorators';
import { AvatarConfigType } from '../types/AvatarOptions';
import { Badge } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(3, 20)
  username?: string;

  @IsOptional()
  @IsAvatarConfig({
    message: 'avatarOptions must have valid keys and number values',
  })
  avatarOptions?: Record<keyof AvatarConfigType, number>;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  friendIds?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  gamesPlayed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gamesWon?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gamesAsWerewolf?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  gamesAsVillager?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(Badge, { each: true })
  @ArrayUnique()
  badges?: Badge[];
}
