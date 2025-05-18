import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Badge } from '../entities/user.entity';

@ObjectType()
export class FriendDto {
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

  @Field(() => [String])
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
