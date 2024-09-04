import { faker } from '@faker-js/faker';
import { genSalt, hash } from 'bcrypt';
import { DataSource, DeepPartial } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Role } from '@/common/guard/role.enum';

import { SeederEntity } from '../../database/entity/seeder.entity';
import { User } from '../entity/user.entity';

export default class User1725477631168 implements Seeder {
  name: string = 'User1725477631168';
  public async run(datasource: DataSource): Promise<any> {
    if (await this.isSeederAlreadyRun(datasource)) return;

    const userData = await this.generateUserData(10);

    await this.saveUserData(datasource, userData);
    await this.recordSeederCompletion(datasource);
  }

  private async isSeederAlreadyRun(datasource: DataSource): Promise<boolean> {
    const seederRepository = datasource.getRepository(SeederEntity);
    return !!(await seederRepository.findOneBy({
      name: User1725477631168.name,
    }));
  }

  private async saveUserData(
    datasource: DataSource,
    data: DeepPartial<User>[],
  ): Promise<void> {
    const userRepo = datasource.getRepository(User);
    await userRepo.save(data);
  }

  private async generateUserData(
    length?: number,
  ): Promise<DeepPartial<User>[]> {
    const salt = await genSalt();
    const hashedPassword = await hash('Qwerty123', salt);
    return Array.from({ length: length ?? 10 }, () => {
      return {
        email: faker.internet.email(),
        password: hashedPassword,
        roles: [Role.User],
      };
    });
  }

  private async recordSeederCompletion(datasource: DataSource): Promise<void> {
    const seederRepository = datasource.getRepository(SeederEntity);
    await seederRepository.save({ name: User1725477631168.name });
  }
}
