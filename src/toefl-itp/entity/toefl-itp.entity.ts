import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Form } from '../../form/entity/form.entity';
import { User } from '../../user/entity/user.entity';

@Entity('toefl_itp')
export class ToeflItp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @PrimaryGeneratedColumn()
  version: number;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: false })
  premium: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToOne(() => Form, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn([
    { name: 'reading_section_id', referencedColumnName: 'id' },
    { name: 'reading_section_version', referencedColumnName: 'version' },
  ])
  readingSection: Form;

  @OneToOne(() => Form, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn([
    { name: 'listening_section_id', referencedColumnName: 'id' },
    { name: 'listening_section_version', referencedColumnName: 'version' },
  ])
  listeningSection: Form;

  @OneToOne(() => Form, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn([
    { name: 'grammar_section_id', referencedColumnName: 'id' },
    { name: 'grammar_section_version', referencedColumnName: 'version' },
  ])
  grammarSection: Form;

  @Column('text', { nullable: true })
  instruction: string;

  @Column('text', { nullable: true })
  closing: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  publishedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
