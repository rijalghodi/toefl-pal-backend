import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSkillTypeInFormAddUniqueFormOrderInPartMakePartNonNullableInQuestion1726922816918 implements MigrationInterface {
    name = 'AddSkillTypeInFormAddUniqueFormOrderInPartMakePartNonNullableInQuestion1726922816918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "part_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "UQ_50466373d230cf2fb79f1971c3f" UNIQUE ("form_id", "order")`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a" FOREIGN KEY ("part_id") REFERENCES "part"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a"`);
        await queryRunner.query(`ALTER TABLE "key" DROP CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a"`);
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "UQ_50466373d230cf2fb79f1971c3f"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "part_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a" FOREIGN KEY ("part_id") REFERENCES "part"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "key" ADD CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
