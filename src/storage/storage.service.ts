import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid'; // Import nanoid
import * as path from 'path'; // Import path to handle file extensions
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
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  }

  // Generate a unique, interpretable filename
  private generateUniqueFilename(originalName: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Generate timestamp
    const uniqueId = nanoid(5); // Generates a 5-character string
    const extension = path.extname(originalName); // Extract file extension

    // Truncate original name to 10 characters and sanitize spaces
    const baseName = path
      .basename(originalName, extension)
      .substring(0, 10)
      .replace(/\s+/g, ''); // Remove spaces instead of replacing them with underscores

    return `${baseName}_${timestamp}_${uniqueId}${extension}`; // Construct unique filename
  }

  // Upload file to Google Cloud Storage
  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const bucket = this.storage.bucket(this.bucketName);

    // Generate the unique, interpretable filename
    const uniqueFilename = this.generateUniqueFilename(file.originalname);

    const blob = bucket.file(uniqueFilename);
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

    // Save file information in the database
    const fileRecord = this.fileRepo.create({
      filename: uniqueFilename,
      originalFilename: file.originalname,
      url: publicUrl,
      mimetype: file.mimetype,
      size: file.size,
    });

    return this.fileRepo.save(fileRecord);
  }
}
