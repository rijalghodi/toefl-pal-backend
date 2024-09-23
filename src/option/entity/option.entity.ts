import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Question } from '../../question/entity/question.entity';

@Entity('option')
@Unique(['question', 'order'])
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column()
  order: number;

  @ManyToOne(() => Question, (v) => v.options, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'question_id' }])
  question?: Question;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
