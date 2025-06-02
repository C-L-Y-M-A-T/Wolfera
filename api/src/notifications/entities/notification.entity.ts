import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationType } from '../Constants/notification-type.enum';

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
