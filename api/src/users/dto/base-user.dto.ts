import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
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
import { AvatarConfigType } from '../types/AvatarOptions';

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

  @Expose()
  @Field({ nullable: true })
  @IsAvatarOptions()
  @IsOptional()
  avatarOptions: Record<keyof AvatarConfigType, number>;

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
function IsAvatarOptions(): (
  target: BaseUserDto,
  propertyKey: 'avatarOptions',
) => void {
  throw new Error('Function not implemented.');
}
