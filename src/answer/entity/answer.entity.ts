import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Attempt } from '../../attempt/entity/attempt.entity';
import { Option } from '../../option/entity/option.entity';
import { Question } from '../../question/entity/question.entity';

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  marked?: boolean;

  @ManyToOne(() => Attempt, (v) => v.id)
  @JoinColumn([{ name: 'attempt_id' }])
  attempt: Attempt;

  @ManyToOne(() => Question, (v) => v.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'question_id' }])
  question: Question;

  @OneToOne(() => Option, (v) => v.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'option_id' }])
  option?: Option;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
