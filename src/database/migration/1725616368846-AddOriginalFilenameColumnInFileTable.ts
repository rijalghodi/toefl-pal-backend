import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOriginalFilenameColumnInFileTable1725616368846
  implements MigrationInterface
{
  name = 'AddOriginalFilenameColumnInFileTable1725616368846';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ADD "original_filename" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP COLUMN "original_filename"`,
    );
  }
}
