import { faker } from '@faker-js/faker';
import { DataSource, DeepPartial } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { User } from '@/user/entity/user.entity';

import { SeederEntity } from '../../database/entity/seeder.entity';
import { Toefl } from '../entity/toefl.entity';

export default class ToeflSeeder1725482866314 implements Seeder {
  private name = 'ToeflSeeder1725482866314';

  public async run(datasource: DataSource): Promise<void> {
    if (await this.isSeederAlreadyRun(datasource)) return;

    const users = await this.getUsers(datasource);

    if (!users || users.length === 0) return;

    const toeflData = this.generateToeflData(users);

    await this.saveToeflData(datasource, toeflData);
    await this.recordSeederCompletion(datasource);
  }

  private async isSeederAlreadyRun(datasource: DataSource): Promise<boolean> {
    const seederRepository = datasource.getRepository(SeederEntity);
    return !!(await seederRepository.findOneBy({
      name: ToeflSeeder1725482866314.name,
    }));
  }

  private async getUsers(
    datasource: DataSource,
    limit?: number,
  ): Promise<User[]> {
    return datasource.getRepository(User).find({ take: limit ?? 10 });
  }

  private generateToeflData(
    users: User[],
    length?: number,
  ): DeepPartial<Toefl>[] {
    return Array.from({ length: length ?? 10 }, () => ({
      name: `Test TOEFL ${faker.number.int({ min: 1, max: 100 })}`,
      description: faker.lorem.sentence(10),
      premium: faker.datatype.boolean(),
      createdBy: faker.helpers.arrayElement(users),
      instruction: faker.lorem.sentence({ min: 50, max: 100 }),
      closing: faker.lorem.sentence({ min: 50, max: 100 }),
    }));
  }

  private async saveToeflData(
    datasource: DataSource,
    data: DeepPartial<Toefl>[],
  ): Promise<void> {
    const toeflRepository = datasource.getRepository(Toefl);
    await toeflRepository.save(data);
  }

  private async recordSeederCompletion(datasource: DataSource): Promise<void> {
    const seederRepository = datasource.getRepository(SeederEntity);
    await seederRepository.save({ name: ToeflSeeder1725482866314.name });
  }
}
