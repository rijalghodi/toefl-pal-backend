import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeOptionOrderUnique1727017365821 implements MigrationInterface {
    name = 'MakeOptionOrderUnique1727017365821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "option" ADD CONSTRAINT "UQ_0112e12d369a78ff5c9a8d80bdf" UNIQUE ("question_id", "order")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "option" DROP CONSTRAINT "UQ_0112e12d369a78ff5c9a8d80bdf"`);
    }
}
