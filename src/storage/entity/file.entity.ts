import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true, name: 'original_filename' })
  originalFilename: string;

  @Column()
  url: string;

  @Column({ nullable: true, name: 'mime_type' })
  mimetype: string;

  @Column({ nullable: true })
  size: number; // in bytes
}
