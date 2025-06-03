import { RoleName } from 'src/roles';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GameEntity } from './game.entity';

@Entity('player_game_result')
export class PlayerGameResult {
  @PrimaryColumn()
  playerId: string;

  @PrimaryColumn()
  gameId: string;

  @ManyToOne(() => GameEntity, (game) => game.playerResults)
  @JoinColumn({ name: 'gameId' })
  game: GameEntity;

  @Column({ type: 'varchar' })
  role: RoleName;

  @Column()
  isWinner: boolean;

  @Column({ default: false })
  survived: boolean;
}
