import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.id = uuidv4();
    return next.handle();
  }
}
