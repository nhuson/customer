import { Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingInterceptor } from '@interceptors/logging.interceptor';
import { RequestInterceptor } from '@interceptors/request.interceptor';
import { ErrorsInterceptor } from '@interceptors/errors.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './modules/customers/customers.module';
import * as configs from '@configs/index';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Object.values(configs).map((val) => val.default),
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('mongoUrl'),
        useNewUrlParser: true
      }),
      inject: [ConfigService]
    }),
    CustomersModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
      scope: Scope.DEFAULT
    },
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
      scope: Scope.DEFAULT
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
      scope: Scope.DEFAULT
    }
  ]
})
export class AppModule {}
