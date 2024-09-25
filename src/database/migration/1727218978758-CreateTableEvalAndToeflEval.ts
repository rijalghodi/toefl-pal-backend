import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableEvalAndToeflEval1727218978758 implements MigrationInterface {
    name = 'CreateTableEvalAndToeflEval1727218978758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "eval" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "correctAnswerNum" integer, "questionNum" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, "attempt_id" uuid NOT NULL, CONSTRAINT "REL_ac7618a772933214f26fa8ec95" UNIQUE ("attempt_id"), CONSTRAINT "PK_12726e6aaccf7860005ab576b2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "toefl_eval" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_score" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "toefl_id" character varying NOT NULL, "user_id" uuid NOT NULL, "reading_eval_id" uuid, "listening_eval_id" uuid, "grammar_eval_id" uuid, CONSTRAINT "PK_06718e2c923e16c43bd346cf8a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD "end_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "toefl" ADD "sample" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "REL_69dad60c2f58e523232f06f5d8"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "eval" ADD CONSTRAINT "FK_ac7618a772933214f26fa8ec95f" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_d58c28546da62ae6bbccde41ee6" FOREIGN KEY ("toefl_id") REFERENCES "toefl"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_b5142cd3a0a6f48e9c8204cfb8f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_f1960cf2a90041f2eeb92a32427" FOREIGN KEY ("reading_eval_id") REFERENCES "eval"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_44cd5e47091ff11148c7e931d12" FOREIGN KEY ("listening_eval_id") REFERENCES "eval"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_780c261edb9ddb03b3c05019dc8" FOREIGN KEY ("grammar_eval_id") REFERENCES "eval"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_780c261edb9ddb03b3c05019dc8"`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_44cd5e47091ff11148c7e931d12"`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_f1960cf2a90041f2eeb92a32427"`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_b5142cd3a0a6f48e9c8204cfb8f"`);
        await queryRunner.query(`ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_d58c28546da62ae6bbccde41ee6"`);
        await queryRunner.query(`ALTER TABLE "eval" DROP CONSTRAINT "FK_ac7618a772933214f26fa8ec95f"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "REL_69dad60c2f58e523232f06f5d8" UNIQUE ("option_id")`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl" DROP COLUMN "sample"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "end_time"`);
        await queryRunner.query(`DROP TABLE "toefl_eval"`);
        await queryRunner.query(`DROP TABLE "eval"`);
    }

}
