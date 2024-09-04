import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from '@/common/guard/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role, { message: 'Please provide valid role.' })
  role?: Role;
}
