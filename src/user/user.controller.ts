// auth.controller.ts
import { Controller, Get, Query, Request } from '@nestjs/common';

import { FilterQueryDto } from '@/common/dto/filter-query.dto';
import { ResponseDto } from '@/common/dto/response.dto';
import { Role } from '@/common/guard/role.enum';
import { Roles } from '@/common/guard/roles.decorator';

import { UserService } from '../user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.SuperAdmin)
  @Get('/')
  async users(@Query() filter: FilterQueryDto) {
    const data = await this.userService.filter(filter);
    return new ResponseDto('list users succeed', data);
  }

  @Get('self')
  async self(@Request() req: any) {
    const profile = await this.userService.findOne({ id: req.user.id });
    return new ResponseDto('get profile succeed', profile);
  }
}
