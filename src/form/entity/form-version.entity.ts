// import { nanoid } from 'nanoid';
// import {
//   BeforeInsert,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToMany,
//   PrimaryColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// import { Part } from '../../part/entity/part.entity';
// import { Form } from './form.entity';

// @Entity('form_version')
// export class FormVersion {
//   @PrimaryColumn()
//   id: string;

//   @ManyToOne(() => Form, (form) => form.formVersion, { nullable: false })
//   @JoinColumn([{ name: 'form_id' }])
//   form: Form;

//   @OneToMany(() => Part, (part) => part.formVersion, { nullable: true })
//   parts?: Part[];

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;

//   @DeleteDateColumn({ name: 'deleted_at', nullable: true })
//   deletedAt?: Date | null;

//   @BeforeInsert()
//   setId() {
//     this.id = nanoid(10);
//   }
// }
