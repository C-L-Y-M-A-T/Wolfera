import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Badge } from '../entities/user.entity';
import { FriendDto } from './friend.dto';

@ObjectType()
export class UserDto {
  @Field()
  @IsUUID()
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  username: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  avatar_url?: string;

  @Field(() => [FriendDto], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => FriendDto)
  @IsOptional()
  friends?: FriendDto[];

  @Field(() => [Badge])
  @IsEnum(Badge, { each: true })
  badges: Badge[];

  @Field()
  @IsNumber()
  gamesPlayed: number;

  @Field()
  @IsNumber()
  gamesWon: number;

  @Field()
  @IsNumber()
  gamesAsWerewolf: number;

  @Field()
  @IsNumber()
  gamesAsVillager: number;
}
