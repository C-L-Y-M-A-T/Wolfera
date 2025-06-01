import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  NEW_ACHIEVEMENT = 'NEW_ACHIEVEMENT',
  GAME_INVITE = 'GAME_INVITE',
}

@Entity()
export class Notification extends BaseEntity {
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column('jsonb', { nullable: true })
  data: any;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  recipientId: string;
}
