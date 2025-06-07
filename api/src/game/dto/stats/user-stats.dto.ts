import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserGameStatsDto {
  @Field()
  totalGames: number;

  @Field()
  gamesWon: number;

  @Field()
  gamesAsWerewolf: number;

  @Field()
  gamesAsVillager: number;

  @Field()
  winRate: number;

  @Field()
  werewolfWinRate: number;

  @Field()
  villagerWinRate: number;

  @Field()
  survivalRate: number;
}
