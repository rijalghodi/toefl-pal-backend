import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Eval } from '../../eval/entity/eval.entity';
import { Toefl } from '../../toefl/entity/toefl.entity';
import { User } from '../../user/entity/user.entity';

@Entity('toefl_eval')
export class ToeflEval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Toefl, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([{ name: 'toefl_id', referencedColumnName: 'id' }])
  toefl: Toefl;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @Column({ default: false, nullable: true })
  stale?: boolean;

  // --- Sections ---   

  @ManyToOne(() => Eval, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'reading_eval_id', referencedColumnName: 'id' }])
  readingEval?: Eval;

  @ManyToOne(() => Eval, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'listening_eval_id', referencedColumnName: 'id' }])
  listeningEval?: Eval;

  @ManyToOne(() => Eval, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'grammar_eval_id', referencedColumnName: 'id' }])
  grammarEval?: Eval;

  @Column({ type: 'float', name: 'total_score', nullable: true })
  totalScore: number;

  @Column({ type: 'float', name: 'max_score', nullable: true })
  maxScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
