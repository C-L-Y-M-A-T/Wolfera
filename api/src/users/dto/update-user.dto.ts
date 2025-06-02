// update-user.dto.ts
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

  @IsOptional()
  @Column('json', { nullable: true })
  avatarOptions?: Record<string, number>;
}
