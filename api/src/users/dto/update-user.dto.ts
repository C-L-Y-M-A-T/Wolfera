import { IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

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
}
