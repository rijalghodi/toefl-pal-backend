import { BadRequestException,Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe implements PipeTransform {
  transform(value?: string | null): boolean | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new BadRequestException('Invalid boolean value');
  }
}
