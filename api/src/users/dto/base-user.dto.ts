import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
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
  @IsOptional()
  avatarOptions?: Record<string, number>;

  @Expose()
  @Field(() => [Badge])
  @IsEnum(Badge, { each: true })
  badges: Badge[];
}
