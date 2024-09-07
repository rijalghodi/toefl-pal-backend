import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeQuestionKeyOneToOneRelationship1725717497640 implements MigrationInterface {
    name = 'MakeQuestionKeyOneToOneRelationship1725717497640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a"`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "UQ_965c9738b529bba3c48fe6f9d6a" UNIQUE ("question_id")`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a"`);
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "UQ_965c9738b529bba3c48fe6f9d6a"`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
