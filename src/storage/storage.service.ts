import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FileEntity } from './entity/file.entity';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName: string = process.env.GOOGLE_CLOUD_BUCKET_NAME;

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
  ) {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped \n with actual newlines
      },
    });
  }

  // Upload file to Google Cloud Storage
  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const bucket = this.storage.bucket(this.bucketName);

    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    const publicUrl = await new Promise<string>((resolve, reject) => {
      blobStream
        .on('finish', () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
          resolve(publicUrl);
        })
        .on('error', (err) => {
          reject(`Unable to upload file: ${err.message}`);
        })
        .end(file.buffer);
    });

    const fileRecord = this.fileRepo.create({
      filename: file.originalname,
      originalFilename: file.originalname,
      url: publicUrl,
      mimetype: file.mimetype,
      size: file.size,
    });

    return this.fileRepo.save(fileRecord);
  }
}
