import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOptionTable1725679831047 implements MigrationInterface {
    name = 'CreateOptionTable1725679831047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4c7564021a60d15e709c4760a91"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_257b73e283ecc8b1805c04350c2"`);
        await queryRunner.query(`CREATE TABLE "option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "question_id" uuid, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "option" ADD CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4c7564021a60d15e709c4760a91" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_257b73e283ecc8b1805c04350c2" FOREIGN KEY ("refernce_id") REFERENCES "reference"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_257b73e283ecc8b1805c04350c2"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4c7564021a60d15e709c4760a91"`);
        await queryRunner.query(`ALTER TABLE "option" DROP CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b"`);
        await queryRunner.query(`DROP TABLE "option"`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_257b73e283ecc8b1805c04350c2" FOREIGN KEY ("refernce_id") REFERENCES "reference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4c7564021a60d15e709c4760a91" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
