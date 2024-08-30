// auth.controller.ts
import { Controller, Get, Query, Request } from '@nestjs/common';

import { Roles } from '@/common/decorator/roles.decorator';
import { FilterQuery } from '@/common/dto/filter-query.dto';
import { ResponseDto } from '@/common/dto/response.dto';

import { UserService } from '../user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(['superadmin'])
  @Get('/')
  async users(@Query() filter: FilterQuery) {
    const data = await this.userService.filter(filter);
    return new ResponseDto('list users succeed', data);
  }

  @Get('profile')
  async profile(@Request() req: any) {
    const profile = await this.userService.findOne({ id: req.user.id });
    return new ResponseDto('get profile succeed', profile);
  }
}
