import { Field, ObjectType } from '@nestjs/graphql';
import { RoleName } from 'src/roles';
import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GameEntity } from './game.entity';

@ObjectType()
@Entity('player_game_result')
export class PlayerGameResult extends BaseEntity {
  @Field()
  @PrimaryColumn()
  playerId: string;

  @Field()
  @PrimaryColumn()
  gameId: string;

  @Field(() => GameEntity, {
    nullable: true,
  })
  @ManyToOne(() => GameEntity, (game) => game.playerResults)
  @JoinColumn({ name: 'gameId' })
  game: GameEntity;

  @Field(() => String)
  @Column({ type: 'varchar' })
  role: RoleName;

  @Field()
  @Column()
  isWinner: boolean;

  @Field({
    defaultValue: false,
  })
  @Column({ default: false })
  survived: boolean;
}
