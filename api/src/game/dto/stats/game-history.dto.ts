import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { GameResult } from 'src/game/entities/game.entity';
import { RoleName } from 'src/roles';

@ObjectType()
export class GameHistoryDto {
  @Expose()
  @Field({ nullable: true })
  code: string;

  @Expose()
  @Field(() => Date, { nullable: true })
  endedAt: Date | null;

  @Expose()
  @Field(() => GameResult, { nullable: true })
  result: GameResult | null;

  @Expose()
  @Field(() => [PlayerGameResultDto])
  playerResults: PlayerGameResultDto[];
}

@ObjectType()
export class PlayerGameResultDto {
  @Expose()
  @Field()
  playerId: string;

  @Expose()
  @Field(() => String)
  role: RoleName;

  @Expose()
  @Field(() => Boolean, { nullable: true })
  isWinner?: boolean | null;

  @Expose()
  @Field(() => Boolean, { nullable: true })
  survived?: boolean | null;
}
