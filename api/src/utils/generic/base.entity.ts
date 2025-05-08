import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeOrmBaseEntity,
  UpdateDateColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  VersionColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  @Exclude({ toPlainOnly: true })
  readonly deletedAt: Date | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  createdBy?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  updatedBy?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  deletedBy?: string;

  @Column({ default: true })
  isActive: boolean;

  // let TypeORM enforce version checks on save:
  @VersionColumn()
  version: number;

  @BeforeInsert()
  protected beforeInsertHook(): void {
    // Lifecycle hook for derived entities to implement
  }

  @BeforeUpdate()
  protected beforeUpdateHook(): void {
    // Lifecycle hook for derived entities to implement
  }

  /**
   * Helper method to safely cast this entity to another type
   * Used for type conversions
   */
  safeCast<T>(): T {
    return this as unknown as T;
  }
}
