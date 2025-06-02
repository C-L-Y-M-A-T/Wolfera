// src/user/dto/avatar-options.input.ts

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AvatarOptionsInput {
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
