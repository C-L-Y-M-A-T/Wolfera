import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
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
  @Min(0)
  gamesPlayed: number;

  @Field()
  @IsNumber()
  @Min(0)
  gamesWon: number;

  @Field()
  @IsNumber()
  @Min(0)
  gamesAsWerewolf: number;

  @Field()
  @IsNumber()
  @Min(0)
  gamesAsVillager: number;
}
