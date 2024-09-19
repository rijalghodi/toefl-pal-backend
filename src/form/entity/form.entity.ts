import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FileEntity } from '../../storage/entity/file.entity';
import { SkillType } from '../enum/skill-type.enum';

@Entity('form')
export class Form {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('int', { default: 25 * 60 })
  duration: number; // in seconds

  @Column('boolean', { name: 'allow_review', default: true })
  allowReview?: boolean;

  @Column({
    type: 'enum',
    name: 'skill_type',
    enum: SkillType,
    default: SkillType.READING,
  })
  testType: SkillType;

  @Column('text', { nullable: true })
  instruction?: string;

  @ManyToOne(() => FileEntity, (file) => file.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'instruction_audio_id', referencedColumnName: 'id' }])
  instructionAudio?: FileEntity;

  @Column('text', { nullable: true })
  closing?: string;

  @ManyToOne(() => FileEntity, (file) => file.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'closing_audio_id', referencedColumnName: 'id' }])
  closingAudio?: FileEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Set ID using nanoid if none is provided
  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = nanoid(10); // Generate a new nanoid if id is not provided
    }
  }
}
