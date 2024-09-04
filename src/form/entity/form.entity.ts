import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('form')
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column('int')
  duration: number; // in seconds

  @Column('boolean', { name: 'allow_review', default: true })
  allowReview: boolean;

  @Column('text')
  instruction: string;

  @Column('text')
  closing: string;
}
