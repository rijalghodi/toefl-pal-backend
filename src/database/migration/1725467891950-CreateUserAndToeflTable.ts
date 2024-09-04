import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserAndToeflTable1725467891950 implements MigrationInterface {
    name = 'CreateUserAndToeflTable1725467891950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL UNIQUE, "password" text NOT NULL, "roles" jsonb NOT NULL DEFAULT '["user"]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "form" ("id" SERIAL NOT NULL, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "duration" integer NOT NULL, "allow_review" boolean NOT NULL DEFAULT true, "instruction" text NOT NULL, "closing" text NOT NULL, CONSTRAINT "PK_645cdcfc663b8e671141a5e8e7c" PRIMARY KEY ("id", "version"))`);
        await queryRunner.query(`CREATE TABLE "toefl_itp" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "version" SERIAL NOT NULL, "description" text, "premium" boolean NOT NULL DEFAULT false, "instruction" text, "closing" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "published_at" TIMESTAMP, "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "reading_section_id" integer, "reading_section_version" integer, "listening_section_id" integer, "listening_section_version" integer, "grammar_section_id" integer, "grammar_section_version" integer, CONSTRAINT "REL_6b808ae13ce63b4ca037b40e45" UNIQUE ("reading_section_id", "reading_section_version"), CONSTRAINT "REL_236d90782e92a0c780de3fc88e" UNIQUE ("listening_section_id", "listening_section_version"), CONSTRAINT "REL_3464aaf954e9f676784594573a" UNIQUE ("grammar_section_id", "grammar_section_version"), CONSTRAINT "PK_e3621bcfea94a1cf10110821699" PRIMARY KEY ("id", "version"))`);
        await queryRunner.query(`ALTER TABLE "toefl_itp" ADD CONSTRAINT "FK_6607cdfeb4a8ec33aa933c0cc28" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_itp" ADD CONSTRAINT "FK_6b808ae13ce63b4ca037b40e45f" FOREIGN KEY ("reading_section_id", "reading_section_version") REFERENCES "form"("id","version") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_itp" ADD CONSTRAINT "FK_236d90782e92a0c780de3fc88ec" FOREIGN KEY ("listening_section_id", "listening_section_version") REFERENCES "form"("id","version") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_itp" ADD CONSTRAINT "FK_3464aaf954e9f676784594573a9" FOREIGN KEY ("grammar_section_id", "grammar_section_version") REFERENCES "form"("id","version") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_itp" DROP CONSTRAINT "FK_3464aaf954e9f676784594573a9"`);
        await queryRunner.query(`ALTER TABLE "toefl_itp" DROP CONSTRAINT "FK_236d90782e92a0c780de3fc88ec"`);
        await queryRunner.query(`ALTER TABLE "toefl_itp" DROP CONSTRAINT "FK_6b808ae13ce63b4ca037b40e45f"`);
        await queryRunner.query(`ALTER TABLE "toefl_itp" DROP CONSTRAINT "FK_6607cdfeb4a8ec33aa933c0cc28"`);
        await queryRunner.query(`DROP TABLE "toefl_itp"`);
        await queryRunner.query(`DROP TABLE "form"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
