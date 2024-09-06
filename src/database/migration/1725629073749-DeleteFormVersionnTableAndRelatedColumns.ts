import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteFormVersionnTableAndRelatedColumns1725629073749 implements MigrationInterface {
    name = 'DeleteFormVersionnTableAndRelatedColumns1725629073749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_e5e4265e39230674e234547e15b"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_20140cc836d355dd11a3bfd87fe"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_452629b40649e8afb298c355c56"`);
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "FK_735c5314c0d24093421f739247d"`);
        await queryRunner.query(`ALTER TABLE "part" RENAME COLUMN "form_version_id" TO "form_id"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP COLUMN "reading_section_version"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP COLUMN "listening_section_version"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP COLUMN "grammar_section_version"`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "FK_861000d0d7439cba228ef1efded" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "form_version"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "FK_861000d0d7439cba228ef1efded"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD "grammar_section_version" character varying`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD "listening_section_version" character varying`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD "reading_section_version" character varying`);
        await queryRunner.query(`ALTER TABLE "part" RENAME COLUMN "form_id" TO "form_version_id"`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "FK_735c5314c0d24093421f739247d" FOREIGN KEY ("form_version_id") REFERENCES "form_version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_452629b40649e8afb298c355c56" FOREIGN KEY ("grammar_section_version") REFERENCES "form_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_20140cc836d355dd11a3bfd87fe" FOREIGN KEY ("listening_section_version") REFERENCES "form_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_e5e4265e39230674e234547e15b" FOREIGN KEY ("reading_section_version") REFERENCES "form_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE IF EXISTS "form_version"`);
        // Problem: no down method for create table form_version
    }

}
