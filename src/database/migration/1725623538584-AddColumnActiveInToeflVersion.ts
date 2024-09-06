import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnActiveInToeflVersion1725623538584 implements MigrationInterface {
    name = 'AddColumnActiveInToeflVersion1725623538584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD "active" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_6da0365735b4b04658b3df830a0"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ALTER COLUMN "toefl_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_6da0365735b4b04658b3df830a0" FOREIGN KEY ("toefl_id") REFERENCES "toefl"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_6da0365735b4b04658b3df830a0"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ALTER COLUMN "toefl_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_6da0365735b4b04658b3df830a0" FOREIGN KEY ("toefl_id") REFERENCES "toefl"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP COLUMN "active"`);
    }

}
