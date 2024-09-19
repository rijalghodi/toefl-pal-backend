import { PartialType } from '@nestjs/mapped-types';

import { CreateToeflDto } from './create-toefl.dto';

export class UpdateToeflDto extends PartialType(CreateToeflDto) {}
