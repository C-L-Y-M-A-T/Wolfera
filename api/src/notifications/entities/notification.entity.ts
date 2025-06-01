import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  NEW_ACHIEVEMENT = 'NEW_ACHIEVEMENT',
  GAME_INVITE = 'GAME_INVITE',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => NotificationType)
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  @Column('jsonb', { nullable: true })
  data: any;

  @Field()
  @Column({ default: false })
  read: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Field()
  @Column()
  recipientId: string;
}
