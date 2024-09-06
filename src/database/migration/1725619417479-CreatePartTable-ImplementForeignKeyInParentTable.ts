import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePartTableImplementForeignKeyInParentTable1725619417479 implements MigrationInterface {
    name = 'CreatePartTableImplementForeignKeyInParentTable1725619417479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "part" ("id" character varying NOT NULL, "order" integer NOT NULL, "name" text, "instruction" text, "closing" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "form_version_id" character varying NOT NULL, CONSTRAINT "PK_58888debdf048d2dfe459aa59da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "FK_735c5314c0d24093421f739247d" FOREIGN KEY ("form_version_id") REFERENCES "form_version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "FK_735c5314c0d24093421f739247d"`);
        await queryRunner.query(`DROP TABLE "part"`);
    }

}
