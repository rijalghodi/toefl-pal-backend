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

import { Form } from './form.entity';

@Entity('form_version')
export class FormVersion {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Form, (form) => form.id, { nullable: false })
  @JoinColumn([{ name: 'form_id', referencedColumnName: 'id' }])
  form: Form;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  setId() {
    this.id = nanoid(10);
  }
}
