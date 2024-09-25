import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Attempt } from '../../attempt/entity/attempt.entity';

@Entity('eval')
export class  Eval {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Attempt, (v) => v.eval, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'attempt_id' }])
  attempt: Attempt;

  @Column({ nullable: true, default: null })
  correctAnswerNum: number;

  @Column({ nullable: true, default: null })
  questionNum: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updatedAt?: Date;
}
