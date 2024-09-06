import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Form } from '../../form/entity/form.entity';
import { FormVersion } from '../../form/entity/form-version.entity';
import { Toefl } from './toefl.entity';

@Entity('toefl_version')
export class ToeflVersion {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Toefl, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'toefl_id' })
  toefl: Toefl;

  @ManyToOne(() => Form, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'reading_section_id', referencedColumnName: 'id' }])
  readingSection: Form;

  @ManyToOne(() => FormVersion, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn([{ name: 'reading_section_version', referencedColumnName: 'id' }])
  readingSectionVersion: FormVersion;

  @ManyToOne(() => Form, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'listening_section_id', referencedColumnName: 'id' }])
  listeningSection: Form;

  @ManyToOne(() => FormVersion, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn([
    { name: 'listening_section_version', referencedColumnName: 'id' },
  ])
  listeningSectionVersion: FormVersion;

  @ManyToOne(() => Form, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'grammar_section_id', referencedColumnName: 'id' }])
  grammarSection: Form;

  @ManyToOne(() => FormVersion, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn([{ name: 'grammar_section_version', referencedColumnName: 'id' }])
  grammarSectionVersion: FormVersion;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Set ID using nanoid if none is provided
  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = nanoid(10);
    }
  }
}
