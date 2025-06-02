import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Column } from 'typeorm';
import { Badge } from '../entities/user.entity';

@ObjectType({ isAbstract: true })
export abstract class BaseUserDto {
  @Expose()
  @Field()
  @IsUUID()
  id: string;

  @Expose()
  @Field()
  @IsEmail()
  email: string;

  @Expose()
  @Field()
  @IsString()
  username: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column('json', { nullable: true })
  avatarOptions?: Record<string, number>;

  @Expose()
  @Field(() => [Badge])
  @IsEnum(Badge, { each: true })
  badges: Badge[];

  @Expose()
  @Field()
  @IsNumber()
  @Min(0)
  gamesPlayed: number;

  @Expose()
  @Field()
  @IsNumber()
  @Min(0)
  gamesWon: number;

  @Expose()
  @Field()
  @IsNumber()
  @Min(0)
  gamesAsWerewolf: number;

  @Expose()
  @Field()
  @IsNumber()
  @Min(0)
  gamesAsVillager: number;
}
