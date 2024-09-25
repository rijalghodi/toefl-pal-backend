import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeAttemptNonNullableInAnswerTable1727253609797 implements MigrationInterface {
    name = 'MakeAttemptNonNullableInAnswerTable1727253609797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "attempt_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "attempt_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
