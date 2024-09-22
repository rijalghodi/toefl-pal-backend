import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeQuestionOrderUnique1726981669696 implements MigrationInterface {
    name = 'MakeQuestionOrderUnique1726981669696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "UQ_e277cb235e4ec106539a08e9617" UNIQUE ("part_id", "order")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "UQ_e277cb235e4ec106539a08e9617"`);
    }

}
