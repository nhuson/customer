import { Injectable, NestInterceptor, ExecutionContext, CallHandler, InternalServerErrorException, Logger, HttpException } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    const logger = new Logger();
    if (req) {
      return next.handle().pipe(
        catchError((error) => {
          const message = error.message;
          logger.error(`[${req.id}] ${req.method} ${req.url} ${Date.now() - now}ms ${error}`);
          if (error instanceof HttpException) {
            throw error;
          }
          throw new InternalServerErrorException(message);
        })
      );
    }
  }
}
