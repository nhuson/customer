import { Injectable, BadRequestException } from '@nestjs/common';
import { PaginateResult, PaginateOptions } from 'mongoose';
import { CustomersRepository } from './customers.repository';
import { ICustomers } from './customers.interface';

@Injectable()
export class CustomersService {
  constructor(private readonly repo: CustomersRepository) {}

  getCustomers(options?: { limit: number; page: number }): Promise<PaginateResult<ICustomers>> {
    const paginateOptions: PaginateOptions = {
      limit: +options?.limit || 20,
      offset: (+options?.page - 1) * +options?.limit
    };
    return this.repo.paginate({}, paginateOptions);
  }

  async createCustomer(data: ICustomers): Promise<ICustomers> {
    const customer = await this.repo.findOne({ $or: [{ username: data.username }, { phone: data.phone }, { email: data.email }] });
    if (customer) {
      throw new BadRequestException('Already exist customer used the username, email or phone');
    }
    return this.repo.create(data);
  }

  async updateCustomer(id: string, data: Partial<ICustomers>): Promise<ICustomers> {
    const customer = await this.repo.findOne({ _id: id });
    if (!customer) {
      throw new BadRequestException('Customer not found!');
    }

    if (data.username || data.phone || data.email) {
      const customer = await this.repo.findOne({
        $or: [{ username: data.username }, { phone: data.phone }, { email: data.email }],
        _id: { $ne: id }
      });
      if (customer) {
        throw new BadRequestException('Already exist customer used the username, email or phone');
      }
    }
    return this.repo.update({ _id: id }, data);
  }

  async getCustomerByCondition(conditions: Record<string, any>): Promise<ICustomers> {
    const customer = await this.repo.findOne(conditions);
    if (!customer) {
      throw new BadRequestException('Customer not found!');
    }
    return customer;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const customer = await this.repo.findOne({ _id: id });
    if (!customer) {
      throw new BadRequestException('Customer not found!');
    }
    await this.repo.remove({ _id: id });
    return true;
  }
}
