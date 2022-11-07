import { Controller, Get, HttpStatus, Query, ValidationPipe, Body, Request, Put, Post, Param, Delete, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginateResult, UpdateQuery } from 'mongoose';
import { CustomersService } from './customers.service';
import { ICustomers } from './customers.interface';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customers.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('')
  @ApiOperation({
    operationId: 'getCustomers',
    description: 'Get list customer.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get list customer.',
    isArray: false
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 20 })
  getCustomers(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    options: {
      page: number;
      limit: number;
    }
  ): Promise<PaginateResult<ICustomers>> {
    return this.customersService.getCustomers(options);
  }

  @Post('')
  @ApiOperation({
    operationId: 'createCustomer',
    description: 'Create a new customer.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a new customer.',
    isArray: false
  })
  createCustomer(@Body() body: CreateCustomerDto): Promise<ICustomers> {
    return this.customersService.createCustomer(body);
  }

  @Put(':id')
  @ApiOperation({
    operationId: 'updateCustomer',
    description: 'Update a new customer.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create a new customer.',
    isArray: false
  })
  updateCustomer(@Body() body: UpdateCustomerDto, @Param('id') id: string): Promise<ICustomers> {
    return this.customersService.updateCustomer(id, body);
  }

  @Get(':id')
  @ApiOperation({
    operationId: 'getCustomerById',
    description: 'Get customer by id.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get customer by id.',
    isArray: false
  })
  getCustomer(@Param('id') id: string): Promise<ICustomers> {
    return this.customersService.getCustomerByCondition({ _id: id });
  }

  @Delete(':id')
  @ApiOperation({
    operationId: 'deleteCustomer',
    description: 'Remove customer by id.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove customer by id.',
    isArray: false
  })
  removeCustomer(@Param('id') id: string): Promise<boolean> {
    return this.customersService.deleteCustomer(id);
  }
}
