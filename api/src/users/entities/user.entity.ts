import { BaseEntity } from 'src/utils/generic/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AvatarConfigType } from '../types/AvatarOptions';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn()
  declare id: string;
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  avatarOptions?: Record<keyof AvatarConfigType, number>;
}
