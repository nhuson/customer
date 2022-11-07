import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersRepository } from './customers.repository';
import { Customers } from './customers.schema';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Customers', schema: Customers }])],
  providers: [CustomersService, CustomersRepository],
  controllers: [CustomersController]
})
export class CustomersModule {}
