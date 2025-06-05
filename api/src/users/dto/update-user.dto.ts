import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { Badge } from '../entities/user.entity';

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

  @Column('json', { nullable: true })
  @IsOptional()
  avatarOptions?: Record<string, number>;

  @IsEnum(Badge, { each: true })
  badges: Badge[];
}
