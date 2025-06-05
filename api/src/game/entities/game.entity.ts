import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PlayerGameResult } from './player-game-result.entity';

export enum GameResult {
  VILLAGERS_WIN = 'villagers_win',
  WEREWOLVES_WIN = 'werewolves_win',
  TIE = 'tie',
  ABANDONED = 'abandoned',
}

registerEnumType(GameResult, {
  name: 'GameResult',
});

@ObjectType({ description: 'Represents a game session' })
@Entity('games')
export class GameEntity extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: string = '';

  @Field(() => Date, {
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Field(() => GameResult, {
    nullable: true,
  })
  @Column({ type: 'enum', enum: GameResult, nullable: true })
  result: GameResult | null;

  @Field(() => [PlayerGameResult])
  @OneToMany(() => PlayerGameResult, (playerResult) => playerResult.game, {
    cascade: true,
  })
  playerResults: PlayerGameResult[];

  @Field()
  @Column({ default: false })
  wasCompleted: boolean;

  @Field(() => String, {
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  winningTeam: string | null;
}
