import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuestionAndReferenceTable1725644878051 implements MigrationInterface {
    name = 'CreateQuestionAndReferenceTable1725644878051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "text" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "audio_id" uuid, CONSTRAINT "PK_01bacbbdd90839b7dce352e4250" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "form_id" character varying NOT NULL, "part_id" uuid, "refernce_id" uuid, "audio_id" uuid, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reference" ADD CONSTRAINT "FK_48109e46b6a6ea5049fd5b159fd" FOREIGN KEY ("audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4c7564021a60d15e709c4760a91" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a" FOREIGN KEY ("part_id") REFERENCES "part"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_257b73e283ecc8b1805c04350c2" FOREIGN KEY ("refernce_id") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_629d7b515e79ada31904e0b6972" FOREIGN KEY ("audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_629d7b515e79ada31904e0b6972"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_257b73e283ecc8b1805c04350c2"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4c7564021a60d15e709c4760a91"`);
        await queryRunner.query(`ALTER TABLE "reference" DROP CONSTRAINT "FK_48109e46b6a6ea5049fd5b159fd"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "reference"`);
    }

}
