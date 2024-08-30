import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
  Optional,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { camelToSnake, snakeToCamel } from '../utils/snake-camel';

export class Strategy {
  in: (value: any) => any;
  out: (value: any) => any;
}

export const DEFAULT_STRATEGY: Strategy = {
  in: camelToSnake,
  out: snakeToCamel,
};

// where NestInterceptor<T, R>, T is stream of response, R is stream of value
@Injectable()
export class CaseSerializeInterceptor implements NestInterceptor<any, any> {
  constructor(@Optional() readonly strategy: Strategy = DEFAULT_STRATEGY) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.body = this.strategy.in(request.body);

    // handle returns stream..
    return next.handle().pipe(map(this.strategy.out));
  }
}
