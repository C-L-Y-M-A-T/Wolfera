import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { GraphQLError } from 'graphql';
import { UsersLoader } from '../dataloader/user.loader';
import { FriendDto } from '../dto/friend.dto';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../user.service';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private userService: UsersService,
    private usersLoader: UsersLoader,
  ) {}

  @Query(() => UserDto, { name: 'userProfile' })
  async getGameProfile(@Args('username') username: string): Promise<UserDto> {
    try {
      const user = await this.userService.findByUsername(username);
      return plainToInstance(UserDto, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLError(`User with username ${username} not found`, {
          extensions: {
            code: 'NOT_FOUND',
            status: error.getStatus(),
          },
        });
      }
      throw error;
    }
  }

  @Query(() => [UserDto], { name: 'allUsers' })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => plainToInstance(UserDto, user));
  }

  @Query(() => UserDto)
  me(@Context() context) {
    if (!context.req.user) {
      throw new GraphQLError('Unauthorized', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }
    return plainToInstance(UserDto, context.req.user);
  }

  @ResolveField('friends', () => [FriendDto], { nullable: true })
  async getFriends(@Parent() user: UserDto): Promise<FriendDto[]> {
    const friends = await this.usersLoader.friendsByUserIdLoader.load(user.id);
    return friends.map((friend) => plainToInstance(FriendDto, friend));
  }
}
