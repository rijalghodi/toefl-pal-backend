import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKeyTable1725681209517 implements MigrationInterface {
    name = 'CreateKeyTable1725681209517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "explanation" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "question_id" uuid, "option_id" uuid, CONSTRAINT "PK_5bd67cf28791e02bf07b0367ace" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "FK_3d23c812899ca256001001d347b" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "FK_3d23c812899ca256001001d347b"`);
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a"`);
        await queryRunner.query(`DROP TABLE "key"`);
    }

}
