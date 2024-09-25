import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Answer } from '../../answer/entity/answer.entity';
import { Eval } from '../../eval/entity/eval.entity';
import { Form } from '../../form/entity/form.entity';
import { Question } from '../../question/entity/question.entity';
import { User } from '../../user/entity/user.entity';

@Entity('attempt')
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'is_practice',
    default: false,
  })
  isPractice?: boolean;

  @ManyToOne(() => Form, (v) => v.id, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'form_id' }])
  form: Form;

  @ManyToOne(() => User, (v) => v.id, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn([{ name: 'created_by' }])
  user: User;

  @ManyToOne(() => Question, (v) => v.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'current_question_id' }])
  currentQuestion?: Question;

  @OneToMany(() => Answer, (v) => v.attempt, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  answers?: Answer[];

  @OneToOne(() => Eval, (v) => v.attempt)
  eval?: Eval;

  @Column({ type: 'timestamp', name: 'end_time', nullable: true })
  endTime?: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'started_at', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', name: 'finished_at', nullable: true })
  finishedAt?: Date;

  @Column({ type: 'timestamp', name: 'canceled_at', nullable: true })
  canceledAt?: Date;
}
