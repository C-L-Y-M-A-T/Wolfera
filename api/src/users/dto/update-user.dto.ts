import { IsAlphanumeric, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsAlphanumeric()
  @Length(3, 20)
  username?: string;

  @IsOptional()
  @IsUrl()
  avatar_url?: string;
}
