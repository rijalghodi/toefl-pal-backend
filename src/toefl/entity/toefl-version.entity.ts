import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Form } from '../../form/entity/form.entity';
import { Toefl } from './toefl.entity';

@Entity('toefl_version')
export class ToeflVersion {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Toefl, (toefl) => toefl.toeflVersions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'toefl_id' })
  toefl: Toefl;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => Form, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'reading_section_id', referencedColumnName: 'id' }])
  readingSection: Form;

  @ManyToOne(() => Form, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'listening_section_id', referencedColumnName: 'id' }])
  listeningSection: Form;

  @ManyToOne(() => Form, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'grammar_section_id', referencedColumnName: 'id' }])
  grammarSection: Form;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // Set ID using nanoid if none is provided
  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = nanoid(10);
    }
  }
}
