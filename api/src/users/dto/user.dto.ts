import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { BaseUserDto } from './base-user.dto';
import { FriendDto } from './friend.dto';

@ObjectType()
export class UserDto extends BaseUserDto {
  @Field(() => [FriendDto], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => FriendDto)
  @IsOptional()
  friends?: FriendDto[];
}
