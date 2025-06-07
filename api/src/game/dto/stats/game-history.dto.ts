import { Field, ObjectType } from '@nestjs/graphql';
import { GameResult } from 'src/game/entities/game.entity';

@ObjectType()
export class GameHistoryDto {
  @Field()
  id: string;

  @Field(() => Date, { nullable: true })
  endedAt: Date | null;

  @Field(() => GameResult, { nullable: true })
  result: GameResult | null;

  @Field()
  wasCompleted: boolean;

  @Field(() => String, {
    nullable: true,
  })
  winningTeam: string | null;

  @Field(() => [PlayerGameResultDto])
  playerResults: PlayerGameResultDto[];
}

@ObjectType()
class PlayerGameResultDto {
  @Field()
  playerId: string;

  @Field()
  role: string;

  @Field()
  isWinner: boolean;

  @Field()
  survived: boolean;
}
