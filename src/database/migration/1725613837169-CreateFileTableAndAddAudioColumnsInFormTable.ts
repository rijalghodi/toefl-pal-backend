import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileTableAndAddAudioColumnsInFormTable1725613837169 implements MigrationInterface {
    name = 'CreateFileTableAndAddAudioColumnsInFormTable1725613837169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" ADD "instruction_audio_id" uuid`);
        await queryRunner.query(`ALTER TABLE "form" ADD "closing_audio_id" uuid`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "mimetype" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "size" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_dd024c78130a16cb72322a0fe1d" FOREIGN KEY ("instruction_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_c96e7ba13cdcf089044fa592f16" FOREIGN KEY ("closing_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_c96e7ba13cdcf089044fa592f16"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_dd024c78130a16cb72322a0fe1d"`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "size" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "mimetype" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "closing_audio_id"`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "instruction_audio_id"`);
    }

}
