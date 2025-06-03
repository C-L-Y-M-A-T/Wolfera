import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PlayerGameResult } from './player-game-result.entity';

export enum GameResult {
  VILLAGERS_WIN = 'villagers_win',
  WEREWOLVES_WIN = 'werewolves_win',
  TIE = 'tie',
  ABANDONED = 'abandoned',
}

@Entity()
export class GameEntity extends BaseEntity {
  @PrimaryColumn()
  id: string = '';

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @Column({ type: 'enum', enum: GameResult, nullable: true })
  result: GameResult | null;

  @OneToMany(() => PlayerGameResult, (playerResult) => playerResult.game, {
    cascade: true,
  })
  playerResults: PlayerGameResult[];

  @Column({ default: false })
  wasCompleted: boolean;

  @Column({ type: 'varchar', nullable: true })
  winningTeam: string | null;
}
