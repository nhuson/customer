import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    let responsePayload = {
      timestamp: new Date().toISOString(),
      path: request.url,
      id: request.id
    };

    if (typeof exceptionResponse === 'object') {
      exceptionResponse.message = `[${request.id ? request.id : ''}] - ${exceptionResponse.message}`;
      responsePayload = { ...responsePayload, ...exceptionResponse };
    }

    response.status(status).json(responsePayload);
  }
}
