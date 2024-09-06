import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumnInToeflToeflVersionFormPart1725625791807 implements MigrationInterface {
    name = 'AddDeletedAtColumnInToeflToeflVersionFormPart1725625791807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_version" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "form_version" DROP COLUMN "deleted_at"`);
    }

}
