import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStaleColumnInToeflEvalTable1727235609095 implements MigrationInterface {
    name = 'AddStaleColumnInToeflEvalTable1727235609095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD "stale" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP COLUMN "stale"`);
    }

}
