import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AvatarConfigType } from '../types/AvatarOptions';

export enum Badge {
  NEW_PLAYER = 'NEW_PLAYER', // Auto-assigned on signup
  FIRST_WIN = 'FIRST_WIN', // Won any game
  WEREWOLF_WIN = 'WEREWOLF_WIN', // Won as Werewolf
  VILLAGE_HERO = 'VILLAGE_HERO', // Won as Villager
  MOON_SURVIVOR = 'MOON_SURVIVOR', // Survived 5+ games
}

registerEnumType(Badge, {
  name: 'Badge',
});

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column()
  hashedPassword: string;

  @Field({ nullable: true })
  avatarOptions: Record<keyof AvatarConfigType, number>;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: 'user_friends',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friendId',
      referencedColumnName: 'id',
    },
  })
  friends?: User[];

  // ---- Game Stats ----
  @Field()
  @Column({ default: 0 })
  gamesPlayed: number;

  @Field()
  @Column({ default: 0 })
  gamesWon: number;

  @Field()
  @Column({ default: 0 })
  gamesAsWerewolf: number;

  @Field()
  @Column({ default: 0 })
  gamesAsVillager: number;

  // ---- Badges ----
  @Field(() => [Badge])
  @Column({
    type: 'enum',
    enum: Badge,
    array: true,
    default: [Badge.NEW_PLAYER],
  })
  badges: Badge[];
}
