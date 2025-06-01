import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private readonly userService: UsersService) {}

  async transform(userId: string) {
    if (!userId) throw new BadRequestException('User ID is required');
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);
    return userId;
  }
}
