import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaxScoreColumnInToeflEvalTable1727233239500 implements MigrationInterface {
    name = 'AddMaxScoreColumnInToeflEvalTable1727233239500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD "max_score" double precision`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP COLUMN "total_score"`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD "total_score" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP COLUMN "total_score"`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD "total_score" integer`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP COLUMN "max_score"`);
    }

}
