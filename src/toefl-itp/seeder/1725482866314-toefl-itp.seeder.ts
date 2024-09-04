import { faker } from '@faker-js/faker';
import { DataSource, DeepPartial } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { User } from '@/user/entity/user.entity';

import { SeederEntity } from '../../database/entity/seeder.entity';
import { ToeflItp } from '../entity/toefl-itp.entity';

export default class ToeflItpSeeder1725482866314 implements Seeder {
  private name = 'ToeflItpSeeder1725482866314';

  public async run(datasource: DataSource): Promise<void> {
    if (await this.isSeederAlreadyRun(datasource)) return;

    const users = await this.getUsers(datasource);

    if (!users || users.length === 0) return;

    const toeflItpData = this.generateToeflItpData(users);

    await this.saveToeflItpData(datasource, toeflItpData);
    await this.recordSeederCompletion(datasource);
  }

  private async isSeederAlreadyRun(datasource: DataSource): Promise<boolean> {
    const seederRepository = datasource.getRepository(SeederEntity);
    return !!(await seederRepository.findOneBy({
      name: ToeflItpSeeder1725482866314.name,
    }));
  }

  private async getUsers(
    datasource: DataSource,
    limit?: number,
  ): Promise<User[]> {
    return datasource.getRepository(User).find({ take: limit ?? 10 });
  }

  private generateToeflItpData(
    users: User[],
    length?: number,
  ): DeepPartial<ToeflItp>[] {
    return Array.from({ length: length ?? 10 }, () => ({
      name: `Test TOEFL ${faker.number.int({ min: 1, max: 100 })}`,
      version: 1,
      description: faker.lorem.sentence(),
      premium: faker.datatype.boolean(),
      createdBy: faker.helpers.arrayElement(users),
      instruction: faker.lorem.sentence({ min: 50, max: 250 }),
      closing: faker.lorem.sentence({ min: 50, max: 250 }),
    }));
  }

  private async saveToeflItpData(
    datasource: DataSource,
    data: DeepPartial<ToeflItp>[],
  ): Promise<void> {
    const toeflItpRepository = datasource.getRepository(ToeflItp);
    await toeflItpRepository.save(data);
  }

  private async recordSeederCompletion(datasource: DataSource): Promise<void> {
    const seederRepository = datasource.getRepository(SeederEntity);
    await seederRepository.save({ name: ToeflItpSeeder1725482866314.name });
  }
}
