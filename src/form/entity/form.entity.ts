import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('form')
export class Form {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('int', { default: 25 * 60 })
  duration: number; // in seconds

  @Column('boolean', { name: 'allow_review', default: true })
  allowReview?: boolean;

  @Column('text', { nullable: true })
  instruction?: string;

  @Column('text', { nullable: true })
  closing?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Set ID using nanoid if none is provided
  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = nanoid(10); // Generate a new nanoid if id is not provided
    }
  }
}
