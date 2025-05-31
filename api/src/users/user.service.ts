import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/utils/generic/base.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  FilterUserDto
> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async syncUser(
    id: string,
    {
      email,
      avatar_url,
      username,
    }: {
      email: string;
      username?: string;
      avatar_url?: string;
    },
  ): Promise<User> {
    console.log('Syncing user', id, email, avatar_url, username);
    // if user exists update it
    const existingUser = await this.findOne({ id });
    if (existingUser) {
      const updatedData: UpdateUserDto = {
        avatar_url: avatar_url || existingUser.avatar_url,
        username: username || existingUser.username || email.split('@')[0],
      };
      return this.updateOne({ id }, updatedData);
    }

    // if user does not exist create it
    let finalUsername = username || email.split('@')[0];
    while (
      await this.userRepo.findOne({ where: { username: finalUsername } })
    ) {
      finalUsername += Math.floor(Math.random() * 10000);
    }
    const newUserDto: CreateUserDto = {
      id,
      email,
      username: finalUsername,
      avatar_url,
    };

    return this.createOne(newUserDto);
  }
}
