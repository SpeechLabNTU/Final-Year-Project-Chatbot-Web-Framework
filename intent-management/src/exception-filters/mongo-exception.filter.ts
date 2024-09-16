import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let message = 'Internal Server Error';

    if (exception.code === 11000) {
      status = 422;
      message = 'Duplicate record!';
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
