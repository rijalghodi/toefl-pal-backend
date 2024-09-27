import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnReadingReferenceDetailInQuestionTable1727409066071 implements MigrationInterface {
    name = 'AddColumnReadingReferenceDetailInQuestionTable1727409066071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "reading_reference_detail" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "reading_reference_detail"`);
    }

}
