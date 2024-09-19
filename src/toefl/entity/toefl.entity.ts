import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entity/user.entity';
import { ToeflVersion } from './toefl-version.entity';

@Entity('toefl')
export class Toefl {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 100, default: 'Untitled' })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ default: false })
  premium: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column('text', { nullable: true })
  instruction?: string;

  @Column('text', { nullable: true })
  closing?: string;

  @OneToMany(() => ToeflVersion, (toeflVersion) => toeflVersion.toefl)
  toeflVersions: ToeflVersion[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  publishedAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

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
