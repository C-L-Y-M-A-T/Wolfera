import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersLoader {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  readonly userByIdLoader = new DataLoader<string, User>(async (ids) => {
    const users = await this.userRepo.findBy({ id: In(ids as string[]) });
    const userMap = new Map(users.map((user) => [user.id, user]));
    return ids.map((id) => {
      const user = userMap.get(id);
      return user ? user : new Error(`User with id ${id} not found`);
    });
  });

  readonly friendsByUserIdLoader = new DataLoader<string, User[]>(
    async (userIds) => {
      const usersWithFriends = await this.userRepo.find({
        where: { id: In(userIds as string[]) },
        relations: ['friends'],
      });

      const friendsMap = new Map<string, User[]>();
      usersWithFriends.forEach((user) => {
        friendsMap.set(user.id, user.friends || []);
      });

      return userIds.map((userId) => friendsMap.get(userId) || []);
    },
  );
}
