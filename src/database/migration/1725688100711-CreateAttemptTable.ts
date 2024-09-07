import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttemptTable1725688100711 implements MigrationInterface {
    name = 'CreateAttemptTable1725688100711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attempt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_practice" boolean, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "started_at" TIMESTAMP, "finished_at" TIMESTAMP, "canceled_at" TIMESTAMP, "form_id" character varying NOT NULL, "created_by" uuid NOT NULL, "current_question_id" uuid, CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_63f8bb943dddbb7ce2793cf529b" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_137e79fb6af74883321225ec2ec" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_8a0833d747b33c222615a0eb6af" FOREIGN KEY ("current_question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_8a0833d747b33c222615a0eb6af"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_137e79fb6af74883321225ec2ec"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_63f8bb943dddbb7ce2793cf529b"`);
        await queryRunner.query(`DROP TABLE "attempt"`);
    }

}
