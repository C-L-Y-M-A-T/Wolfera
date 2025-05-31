import { IsAlphanumeric, IsEmail, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Length(5, 255)
  email: string;
  @IsAlphanumeric()
  @Length(3, 20)
  username: string;

  @IsUrl()
  avatar_url: string;
}
