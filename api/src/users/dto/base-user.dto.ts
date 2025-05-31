import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Badge } from '../entities/user.entity';

@ObjectType({ isAbstract: true })
export abstract class BaseUserDto {
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
