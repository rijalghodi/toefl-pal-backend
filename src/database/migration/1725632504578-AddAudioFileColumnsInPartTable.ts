import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAudioFileColumnsInPartTable1725632504578 implements MigrationInterface {
    name = 'AddAudioFileColumnsInPartTable1725632504578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "part" ADD "instruction_audio_id" uuid`);
        await queryRunner.query(`ALTER TABLE "part" ADD "closing_audio_id" uuid`);
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "PK_58888debdf048d2dfe459aa59da"`);
        await queryRunner.query(`ALTER TABLE "part" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "part" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "PK_58888debdf048d2dfe459aa59da" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "FK_7c6cafbadd0062e8918dd4b181f" FOREIGN KEY ("instruction_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "FK_86f9e2d49f243ef0694d5599218" FOREIGN KEY ("closing_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "FK_86f9e2d49f243ef0694d5599218"`);
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "FK_7c6cafbadd0062e8918dd4b181f"`);
        await queryRunner.query(`ALTER TABLE "part" DROP CONSTRAINT "PK_58888debdf048d2dfe459aa59da"`);
        await queryRunner.query(`ALTER TABLE "part" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "part" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "part" ADD CONSTRAINT "PK_58888debdf048d2dfe459aa59da" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "part" DROP COLUMN "closing_audio_id"`);
        await queryRunner.query(`ALTER TABLE "part" DROP COLUMN "instruction_audio_id"`);
    }

}
