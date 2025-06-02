import { IsAlphanumeric, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsAlphanumeric()
  @Length(3, 20)
  username?: string;

  email?: string;

  hashedPassword?: string;
}
