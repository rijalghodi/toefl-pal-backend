import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateToeflForm1725564116411 implements MigrationInterface {
    name = 'CreateToeflForm1725564116411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "toefl" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "description" text, "premium" boolean NOT NULL DEFAULT false, "instruction" text, "closing" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "published_at" TIMESTAMP, "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, CONSTRAINT "PK_8d49575ec921431844b0c369d96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "form_version" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "form_id" character varying, CONSTRAINT "PK_5992da09af1567a95aec97bcf9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "toefl_version" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "toefl_id" character varying, "created_by" uuid, "reading_section_id" character varying, "reading_section_version" character varying, "listening_section_id" character varying, "listening_section_version" character varying, "grammar_section_id" character varying, "grammar_section_version" character varying, CONSTRAINT "PK_3f225c6041998c7895f52b5fad7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`DROP TABLE "toefl_itp"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "PK_645cdcfc663b8e671141a5e8e7c"`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e"`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "form" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "form" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "toefl" ADD CONSTRAINT "FK_4a221c7d9fc16ee2269df4117cb" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_version" ADD CONSTRAINT "FK_c212f6d8dc4ef30d333b8fb4c00" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_6da0365735b4b04658b3df830a0" FOREIGN KEY ("toefl_id") REFERENCES "toefl"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_34ee2d50dacbf1f97b22e4b6f30" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_c3c24cd2acc5276193db0f9053d" FOREIGN KEY ("reading_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_e5e4265e39230674e234547e15b" FOREIGN KEY ("reading_section_version") REFERENCES "form_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_ea53408dd881194667ad6799e53" FOREIGN KEY ("listening_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_20140cc836d355dd11a3bfd87fe" FOREIGN KEY ("listening_section_version") REFERENCES "form_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_c85d7cdeeb3804968002dc64aac" FOREIGN KEY ("grammar_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "toefl_version" ADD CONSTRAINT "FK_452629b40649e8afb298c355c56" FOREIGN KEY ("grammar_section_version") REFERENCES "form_version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_452629b40649e8afb298c355c56"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_c85d7cdeeb3804968002dc64aac"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_20140cc836d355dd11a3bfd87fe"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_ea53408dd881194667ad6799e53"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_e5e4265e39230674e234547e15b"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_c3c24cd2acc5276193db0f9053d"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_34ee2d50dacbf1f97b22e4b6f30"`);
        await queryRunner.query(`ALTER TABLE "toefl_version" DROP CONSTRAINT "FK_6da0365735b4b04658b3df830a0"`);
        await queryRunner.query(`ALTER TABLE "form_version" DROP CONSTRAINT "FK_c212f6d8dc4ef30d333b8fb4c00"`);
        await queryRunner.query(`ALTER TABLE "toefl" DROP CONSTRAINT "FK_4a221c7d9fc16ee2269df4117cb"`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "form" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e"`);
        await queryRunner.query(`ALTER TABLE "form" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "form" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "form" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e"`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "PK_645cdcfc663b8e671141a5e8e7c" PRIMARY KEY ("id", "version")`);
        await queryRunner.query(`CREATE TABLE "toefl_itp" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "version" SERIAL NOT NULL, "description" text, "premium" boolean NOT NULL DEFAULT false, "instruction" text, "closing" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "published_at" TIMESTAMP, "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "reading_section_id" integer, "reading_section_version" integer, "listening_section_id" integer, "listening_section_version" integer, "grammar_section_id" integer, "grammar_section_version" integer, CONSTRAINT "REL_6b808ae13ce63b4ca037b40e45" UNIQUE ("reading_section_id", "reading_section_version"), CONSTRAINT "REL_236d90782e92a0c780de3fc88e" UNIQUE ("listening_section_id", "listening_section_version"), CONSTRAINT "REL_3464aaf954e9f676784594573a" UNIQUE ("grammar_section_id", "grammar_section_version"), CONSTRAINT "PK_e3621bcfea94a1cf10110821699" PRIMARY KEY ("id", "version"))`,);
        await queryRunner.query(`DROP TABLE "toefl_version"`);
        await queryRunner.query(`DROP TABLE "form_version"`);
        await queryRunner.query(`DROP TABLE "toefl"`);
    }

}
