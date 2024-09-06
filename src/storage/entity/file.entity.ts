import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  originalFilename: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  mimetype: string;

  @Column({ nullable: true })
  size: number; // in bytes
}
