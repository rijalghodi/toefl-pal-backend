import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultFalseInIsPracticeColumnAttemptTable1725688211841 implements MigrationInterface {
    name = 'SetDefaultFalseInIsPracticeColumnAttemptTable1725688211841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "is_practice" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" ALTER COLUMN "is_practice" DROP DEFAULT`);
    }

}
