import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { CustomersRepository } from './customers.repository';
import { ICustomers } from './customers.interface';

describe('CustomersService', () => {
  let service: CustomersService;

  const mockCustomerRepository = {
    findOne: jest.fn(),
    paginate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, CustomersRepository]
    })
      .overrideProvider(CustomersRepository)
      .useValue(mockCustomerRepository)
      .compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockCustomerRepository.paginate.mockResolvedValue({
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
      const result = await service.getCustomers();
      expect(result.docs.length).toEqual(mockData.length);
    });
  });

  describe('createCustomer', () => {
    it('Should throw error when create customer has username already existed in DB.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(mockData);
      try {
        await service.createCustomer(mockData);
      } catch (error) {
        expect(error.message).toEqual('Already exist customer used the username, email or phone');
      }
    });

    it('Should be create customer success.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(null);
      mockCustomerRepository.create.mockResolvedValue(mockData);

      const result = await service.createCustomer(mockData);
      expect(result.username).toEqual(mockData.username);
    });
  });

  describe('updateCustomer', () => {
    it('Should throw error not found customer.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(null);
      try {
        await service.updateCustomer(mockData._id, mockData);
      } catch (error) {
        expect(error.message).toEqual('Customer not found!');
      }
    });

    it('Should throw error when update customer has username already existed in DB.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(mockData);
      try {
        await service.updateCustomer(mockData._id, mockData);
      } catch (error) {
        expect(error.message).toEqual('Already exist customer used the username, email or phone');
      }
    });

    it('Should update customer success.', async () => {
      const mockData: ICustomers = {
        username: 'username',
        phone: '+84123456785',
        email: 'test@gmail.com',
        address: 'string',
        avatar: 'string',
        bio: 'string',
        dob: new Date('2022-11-07T09:44:43.504Z')
      };
      mockCustomerRepository.findOne.mockResolvedValueOnce(mockData);
      mockCustomerRepository.findOne.mockResolvedValueOnce(null);
      mockCustomerRepository.update.mockResolvedValue(mockData);
      const result = await service.updateCustomer(mockData._id, mockData);

      expect(result.username).toEqual(mockData.username);
    });
  });

  describe('getCustomerByCondition', () => {
    it('Should throw error when pass wrong condition.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(null);
      try {
        const result = await service.getCustomerByCondition({ username: 'abcabc' });
      } catch (error) {
        expect(error.message).toEqual('Customer not found!');
      }
    });

    it('Should be return customer data.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(mockData);
      const result = await service.getCustomerByCondition({ username: 'username' });
      expect(result.username).toEqual(mockData.username);
    });
  });

  describe('deleteCustomer', () => {
    it('Should throw error when delete customer not existed.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(null);
      try {
        const result = await service.deleteCustomer(mockData._id);
      } catch (error) {
        expect(error.message).toEqual('Customer not found!');
      }
    });

    it('Should be return true when delete customer.', async () => {
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
      mockCustomerRepository.findOne.mockResolvedValue(mockData);
      const result = await service.deleteCustomer(mockData._id);
      expect(result).toEqual(true);
    });
  });
});
