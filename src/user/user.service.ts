import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

import { FilterQuery } from '@/common/dto/filter-query.dto';
import { Pagination } from '@/common/dto/response.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create(payload);
    return this.userRepo.save(newUser);
  }

  async filter(
    filter: FilterQuery,
  ): Promise<{ data: User[]; pagination: Pagination }> {
    const [data, count] = await this.userRepo.findAndCount({
      select: ['id', 'email', 'name', 'role', 'created_at'],
      where: {
        name: Like(`%${filter.search}%`),
        email: Like(`%${filter.search}%`),
      },
      take: filter.limit,
      skip: (filter.page - 1) * filter.limit,
      order: { [filter.order]: filter.sort },
    });

    return {
      data,
      pagination: {
        page: filter.page,
        pageSize: data.length,
        totalPage: Math.ceil(count / filter.limit),
        totalData: count,
      },
    };
  }

  async checkDuplicate(options: FindOptionsWhere<User>): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: options,
      select: { password: false },
    });
    return !!user;
  }

  async findOne(options: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepo.findOne({
      where: options,
      select: { password: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneWithPassword(options: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepo.findOne({
      where: options,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
