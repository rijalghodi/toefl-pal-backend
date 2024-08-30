import { Reflector } from '@nestjs/core';

import { IRole } from '../interface/role';

export const Roles = Reflector.createDecorator<IRole[]>({});
