import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveToeflVersionTableAddFormsDirectlyInToefl1727155173943
  implements MigrationInterface
{
  name = 'RemoveToeflVersionTableAddFormsDirectlyInToefl1727155173943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "toefl_version"`);
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD "reading_section_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD "listening_section_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD "grammar_section_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD CONSTRAINT "FK_a8676a24a8670292720a5a6e2a4" FOREIGN KEY ("reading_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD CONSTRAINT "FK_c2df31639bd1888cb6034fc79c1" FOREIGN KEY ("listening_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD CONSTRAINT "FK_9fd637ff963f528b6a0f5301c12" FOREIGN KEY ("grammar_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP CONSTRAINT "FK_9fd637ff963f528b6a0f5301c12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP CONSTRAINT "FK_c2df31639bd1888cb6034fc79c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP CONSTRAINT "FK_a8676a24a8670292720a5a6e2a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP COLUMN "grammar_section_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP COLUMN "listening_section_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP COLUMN "reading_section_id"`,
    );
  }
}
