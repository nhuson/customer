import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '@shared/base.repository';
import { ICustomersModel } from './customers.model';

@Injectable()
export class CustomersRepository extends BaseRepository<ICustomersModel> {
  constructor(@InjectModel('Customers') model) {
    super(model);
  }
}
