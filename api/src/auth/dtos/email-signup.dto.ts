import { IsEmail, IsString, MinLength } from 'class-validator';

export class EmailSignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
