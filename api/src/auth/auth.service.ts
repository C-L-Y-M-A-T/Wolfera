import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/user.service';
import { SignupDto } from './dtos/signup.dto';
import { AccessToken } from './types/AccessToken';
import { AccessTokenPayload } from './types/AccessTokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.hashedPassword);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  login(user: User): AccessToken {
    const payload: AccessTokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(user: SignupDto): Promise<AccessToken> {
    const existingEmail = await this.usersService.findByEmail(user.email);
    if (existingEmail) {
      throw new BadRequestException('email already exists');
    }

    const existingUsername = await this.usersService.findByUsername(
      user.username,
    );
    if (existingUsername) {
      throw new BadRequestException('username already exists');
    }

    const hashedPassword: string = await bcrypt.hash(user.password, 10);
    const newUser = {
      email: user.email,
      username: user.username,
      hashedPassword,
    };
    await this.usersService.create(newUser);
    const createdUser = await this.usersService.findByEmail(user.email);
    if (!createdUser) {
      throw new BadRequestException('User creation failed');
    }
    return this.login(createdUser);
  }
}
