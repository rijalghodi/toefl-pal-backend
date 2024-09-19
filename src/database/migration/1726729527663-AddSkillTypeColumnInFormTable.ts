import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSkillTypeColumnInFormTable1726729527663 implements MigrationInterface {
    name = 'AddSkillTypeColumnInFormTable1726729527663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."form_skill_type_enum" AS ENUM('listening', 'grammar', 'reading')`);
        await queryRunner.query(`ALTER TABLE "form" ADD "skill_type" "public"."form_skill_type_enum" NOT NULL DEFAULT 'reading'`);
        await queryRunner.query(`ALTER TABLE "toefl" ALTER COLUMN "name" SET DEFAULT 'Untitled'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "skill_type"`);
        await queryRunner.query(`DROP TYPE "public"."form_skill_type_enum"`);
    }

}
