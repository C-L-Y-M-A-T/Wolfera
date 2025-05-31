import { ObjectType } from '@nestjs/graphql';
import { BaseUserDto } from './base-user.dto';

@ObjectType()
export class FriendDto extends BaseUserDto {}
