import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Form } from '../../form/entity/form.entity';
import { Question } from '../../question/entity/question.entity';
import { FileEntity } from '../../storage/entity/file.entity';

@Entity('part')
@Unique(['form', 'order']) // Composite unique constraint on form_id and order
export class Part {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Form, (formVersion) => formVersion.id, {
    nullable: false,
  })
  @JoinColumn([{ name: 'form_id' }])
  form: Form;

  @OneToMany(() => Question, (v) => v.part, {
    nullable: false,
  })
  questions: Question[];

  @Column()
  order: number; // No need for @Unique here, handled by composite constraint

  @Column({ type: 'text', nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  instruction?: string;

  @ManyToOne(() => FileEntity, (file) => file.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'instruction_audio_id', referencedColumnName: 'id' }])
  instructionAudio: FileEntity;

  @ManyToOne(() => FileEntity, (file) => file.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'closing_audio_id', referencedColumnName: 'id' }])
  closingAudio: FileEntity;

  @Column({ type: 'text', nullable: true })
  closing?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
