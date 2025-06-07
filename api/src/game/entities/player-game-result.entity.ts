import { Field, ObjectType } from '@nestjs/graphql';
import { RoleName } from 'src/roles';
import { User } from 'src/users/entities/user.entity';
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

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'playerId' })
  player: User;

  @Field(() => String)
  @Column({ type: 'varchar' })
  role: RoleName;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: false, default: false })
  isWinner?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: false, default: true })
  survived?: boolean | null;
}
