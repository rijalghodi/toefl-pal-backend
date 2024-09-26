import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateToeflpalDbV11727349866463 implements MigrationInterface {
  name = 'GenerateToeflpalDbV11727349866463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" text NOT NULL, "roles" jsonb NOT NULL DEFAULT '["user"]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "question_id" uuid, CONSTRAINT "UQ_0112e12d369a78ff5c9a8d80bdf" UNIQUE ("question_id", "order"), CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "explanation" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "question_id" uuid, "option_id" uuid, CONSTRAINT "REL_965c9738b529bba3c48fe6f9d6" UNIQUE ("question_id"), CONSTRAINT "PK_5bd67cf28791e02bf07b0367ace" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying, "original_filename" character varying, "url" character varying NOT NULL, "mime_type" character varying, "size" integer, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "text" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "audio_id" uuid, CONSTRAINT "PK_01bacbbdd90839b7dce352e4250" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text, "order" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "form_id" character varying NOT NULL, "part_id" uuid NOT NULL, "refernce_id" uuid, "audio_id" uuid, CONSTRAINT "UQ_e277cb235e4ec106539a08e9617" UNIQUE ("part_id", "order"), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "part" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "name" text, "instruction" text, "closing" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "form_id" character varying NOT NULL, "instruction_audio_id" uuid, "closing_audio_id" uuid, CONSTRAINT "UQ_50466373d230cf2fb79f1971c3f" UNIQUE ("form_id", "order"), CONSTRAINT "PK_58888debdf048d2dfe459aa59da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."form_skill_type_enum" AS ENUM('listening', 'grammar', 'reading')`,
    );
    await queryRunner.query(
      `CREATE TABLE "form" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL, "duration" integer NOT NULL DEFAULT '50', "allow_review" boolean NOT NULL DEFAULT true, "skill_type" "public"."form_skill_type_enum" NOT NULL DEFAULT 'reading', "instruction" text, "closing" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "instruction_audio_id" uuid, "closing_audio_id" uuid, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "toefl" ("id" character varying NOT NULL, "name" character varying(100) NOT NULL DEFAULT 'Untitled', "description" text, "sample" boolean NOT NULL DEFAULT false, "premium" boolean NOT NULL DEFAULT false, "instruction" text, "closing" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "published_at" TIMESTAMP, "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "reading_section_id" character varying, "listening_section_id" character varying, "grammar_section_id" character varying, CONSTRAINT "PK_8d49575ec921431844b0c369d96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "marked" boolean DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "attempt_id" uuid NOT NULL, "question_id" uuid, "option_id" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "attempt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_practice" boolean DEFAULT false, "end_time" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "started_at" TIMESTAMP, "finished_at" TIMESTAMP, "canceled_at" TIMESTAMP, "form_id" character varying NOT NULL, "created_by" uuid NOT NULL, "current_question_id" uuid, CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "correctAnswerNum" integer, "questionNum" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, "attempt_id" uuid NOT NULL, CONSTRAINT "REL_ac7618a772933214f26fa8ec95" UNIQUE ("attempt_id"), CONSTRAINT "PK_12726e6aaccf7860005ab576b2c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "toefl_eval" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stale" boolean DEFAULT false, "total_score" double precision, "max_score" double precision, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "toefl_id" character varying NOT NULL, "user_id" uuid NOT NULL, "reading_eval_id" uuid, "listening_eval_id" uuid, "grammar_eval_id" uuid, CONSTRAINT "PK_06718e2c923e16c43bd346cf8a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "seeder" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d4f5f29c8387f8f02a38b0eb1b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" ADD CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "key" ADD CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "key" ADD CONSTRAINT "FK_3d23c812899ca256001001d347b" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" ADD CONSTRAINT "FK_48109e46b6a6ea5049fd5b159fd" FOREIGN KEY ("audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_4c7564021a60d15e709c4760a91" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a" FOREIGN KEY ("part_id") REFERENCES "part"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_257b73e283ecc8b1805c04350c2" FOREIGN KEY ("refernce_id") REFERENCES "reference"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_629d7b515e79ada31904e0b6972" FOREIGN KEY ("audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "part" ADD CONSTRAINT "FK_861000d0d7439cba228ef1efded" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "part" ADD CONSTRAINT "FK_7c6cafbadd0062e8918dd4b181f" FOREIGN KEY ("instruction_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "part" ADD CONSTRAINT "FK_86f9e2d49f243ef0694d5599218" FOREIGN KEY ("closing_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "form" ADD CONSTRAINT "FK_dd024c78130a16cb72322a0fe1d" FOREIGN KEY ("instruction_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "form" ADD CONSTRAINT "FK_c96e7ba13cdcf089044fa592f16" FOREIGN KEY ("closing_audio_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD CONSTRAINT "FK_4a221c7d9fc16ee2269df4117cb" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD CONSTRAINT "FK_a8676a24a8670292720a5a6e2a4" FOREIGN KEY ("reading_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD CONSTRAINT "FK_c2df31639bd1888cb6034fc79c1" FOREIGN KEY ("listening_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" ADD CONSTRAINT "FK_9fd637ff963f528b6a0f5301c12" FOREIGN KEY ("grammar_section_id") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" ADD CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d" FOREIGN KEY ("option_id") REFERENCES "option"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_63f8bb943dddbb7ce2793cf529b" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_137e79fb6af74883321225ec2ec" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" ADD CONSTRAINT "FK_8a0833d747b33c222615a0eb6af" FOREIGN KEY ("current_question_id") REFERENCES "question"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval" ADD CONSTRAINT "FK_ac7618a772933214f26fa8ec95f" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_d58c28546da62ae6bbccde41ee6" FOREIGN KEY ("toefl_id") REFERENCES "toefl"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_b5142cd3a0a6f48e9c8204cfb8f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_f1960cf2a90041f2eeb92a32427" FOREIGN KEY ("reading_eval_id") REFERENCES "eval"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_44cd5e47091ff11148c7e931d12" FOREIGN KEY ("listening_eval_id") REFERENCES "eval"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" ADD CONSTRAINT "FK_780c261edb9ddb03b3c05019dc8" FOREIGN KEY ("grammar_eval_id") REFERENCES "eval"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_780c261edb9ddb03b3c05019dc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_44cd5e47091ff11148c7e931d12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_f1960cf2a90041f2eeb92a32427"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_b5142cd3a0a6f48e9c8204cfb8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl_eval" DROP CONSTRAINT "FK_d58c28546da62ae6bbccde41ee6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval" DROP CONSTRAINT "FK_ac7618a772933214f26fa8ec95f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP CONSTRAINT "FK_8a0833d747b33c222615a0eb6af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP CONSTRAINT "FK_137e79fb6af74883321225ec2ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attempt" DROP CONSTRAINT "FK_63f8bb943dddbb7ce2793cf529b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_69dad60c2f58e523232f06f5d8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_c3d19a89541e4f0813f2fe09194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer" DROP CONSTRAINT "FK_19d1fa780999ce88def2f8ab8df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP CONSTRAINT "FK_9fd637ff963f528b6a0f5301c12"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP CONSTRAINT "FK_c2df31639bd1888cb6034fc79c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP CONSTRAINT "FK_a8676a24a8670292720a5a6e2a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toefl" DROP CONSTRAINT "FK_4a221c7d9fc16ee2269df4117cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "form" DROP CONSTRAINT "FK_c96e7ba13cdcf089044fa592f16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "form" DROP CONSTRAINT "FK_dd024c78130a16cb72322a0fe1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "part" DROP CONSTRAINT "FK_86f9e2d49f243ef0694d5599218"`,
    );
    await queryRunner.query(
      `ALTER TABLE "part" DROP CONSTRAINT "FK_7c6cafbadd0062e8918dd4b181f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "part" DROP CONSTRAINT "FK_861000d0d7439cba228ef1efded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_629d7b515e79ada31904e0b6972"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_257b73e283ecc8b1805c04350c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_1c8ea05390c76bdbb0a3580275a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_4c7564021a60d15e709c4760a91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reference" DROP CONSTRAINT "FK_48109e46b6a6ea5049fd5b159fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "key" DROP CONSTRAINT "FK_3d23c812899ca256001001d347b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "key" DROP CONSTRAINT "FK_965c9738b529bba3c48fe6f9d6a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "option" DROP CONSTRAINT "FK_790cf6b252b5bb48cd8fc1d272b"`,
    );
    await queryRunner.query(`DROP TABLE "seeder"`);
    await queryRunner.query(`DROP TABLE "toefl_eval"`);
    await queryRunner.query(`DROP TABLE "eval"`);
    await queryRunner.query(`DROP TABLE "attempt"`);
    await queryRunner.query(`DROP TABLE "answer"`);
    await queryRunner.query(`DROP TABLE "toefl"`);
    await queryRunner.query(`DROP TABLE "form"`);
    await queryRunner.query(`DROP TYPE "public"."form_skill_type_enum"`);
    await queryRunner.query(`DROP TABLE "part"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "reference"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "key"`);
    await queryRunner.query(`DROP TABLE "option"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
