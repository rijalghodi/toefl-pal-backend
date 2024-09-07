import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAnswerTable1725694545712 implements MigrationInterface {
    name = 'CreateAnswerTable1725694545712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "marked" boolean DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "attempt_id" uuid, "question_id" uuid, "option_id" uuid, CONSTRAINT "REL_69dad60c2f58e523232f06f5d8" UNIQUE ("option_id"), CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df"`);
        await queryRunner.query(`DROP TABLE "answer"`);
    }

}
