// src/user/models/avatar-options.model.ts

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AvatarOptions {
  @Field({ nullable: true })
  hair: number;

  @Field({ nullable: true })
  eyes: number;

  @Field({ nullable: true })
  eyebrows: number;

  @Field({ nullable: true })
  mouth: number;

  @Field({ nullable: true })
  skinColor: number;

  @Field({ nullable: true })
  hairColor: number;

  @Field({ nullable: true })
  backgroundColor: number;
}
