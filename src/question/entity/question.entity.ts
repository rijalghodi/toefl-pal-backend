import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Form } from '../../form/entity/form.entity';
import { Key } from '../../key/entity/key.entity';
import { Option } from '../../option/entity/option.entity';
import { Part } from '../../part/entity/part.entity';
import { Reference } from '../../reference/entity/reference.entity';
import { FileEntity } from '../../storage/entity/file.entity';

@Entity('question')
@Unique(['part', 'order'])
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  text?: string;

  @Column()
  order: number;

  @ManyToOne(() => Form, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'form_id' }])
  form: Form;

  @ManyToOne(() => Part, (v) => v.questions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'part_id' }])
  part?: Part;

  @ManyToOne(() => Reference, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'refernce_id' }])
  reference?: Reference;

  @Column({ nullable: true, name: 'reading_reference_detail' })
  readingReferenceDetail?: string;

  @ManyToOne(() => FileEntity, (file) => file.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'audio_id', referencedColumnName: 'id' }])
  audio: FileEntity;

  @OneToMany(() => Option, (v) => v.question)
  options?: Option[];

  @OneToOne(() => Key, (v) => v.question)
  key?: Key;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
