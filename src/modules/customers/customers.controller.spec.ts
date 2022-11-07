import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { ICustomers } from './customers.interface';

describe('CustomersController', () => {
  let controller: CustomersController;
  const mockCustomersService = {
    getCustomers: jest.fn(),
    createCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    getCustomerByCondition: jest.fn(),
    deleteCustomer: jest.fn()
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService
        }
      ]
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCustomers', () => {
    it('Should be return customer array.', async () => {
      const mockData: ICustomers[] = [
        {
          _id: '6368d41747f5c868d6d1280b',
          username: 'username',
          phone: '+84123456785',
          email: 'test@gmail.com',
          address: 'string',
          avatar: 'string',
          bio: 'string',
          dob: new Date('2022-11-07T09:44:43.504Z')
        }
      ];
      mockCustomersService.getCustomers.mockResolvedValue({
        docs: mockData,
        totalDocs: 1,
        offset: 0,
        limit: 20,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      });
      const result = await controller.getCustomers({ limit: 1, page: 1 });
      expect(result.docs.length).toEqual(mockData.length);
    });
  });

  describe('createCustomer', () => {
    it('Should be create success customer.', async () => {
      const mockData: ICustomers = {
        _id: '6368d41747f5c868d6d1280b',
        username: 'username',
        phone: '+84123456785',
        email: 'test@gmail.com',
        address: 'string',
        avatar: 'string',
        bio: 'string',
        dob: new Date('2022-11-07T09:44:43.504Z')
      };
      mockCustomersService.createCustomer.mockResolvedValue(mockData);
      const result = await controller.createCustomer(mockData);
      expect(result._id).toEqual(mockData._id);
    });
  });
});
