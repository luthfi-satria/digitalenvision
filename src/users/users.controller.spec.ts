import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserDto } from './dto/users.dto';
import { AccountDocuments } from './entities/users.entities';

describe('UsersController', () => {
  let userController: UsersController;
  const mockUsersService = {
    register: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
  });

  // UNIT TEST - CONTROLLER EXISTENCE
  it('controller should be defined', () => {
    expect(userController).toBeDefined();
  });

  // UNIT TEST - VALIDATION OF DTO
  it('register validation => user registration should be failed', async () => {
    const createUsersDto: UserDto = {
      firstName: '',
      lastName: '',
      area: '',
      country: '',
      dob: '',
    } as UserDto;

    const plainUsersDto = plainToInstance(UserDto, createUsersDto);
    const error = await validate(plainUsersDto);

    expect(error.length).not.toBe(0);
  });

  // UNIT TEST - REGISTRATION USER
  it('register => user should be successfully registered', async () => {
    const createUsersDto: UserDto = {
      firstName: 'first test',
      lastName: 'last test',
      area: 'Asia',
      country: 'Indonesia',
      region: 'Jakarta',
      dob: '2001-01-01',
    } as UserDto;

    const userData = {
      firstName: 'first test',
      lastName: 'last test',
      area: 'Asia',
      country: 'Indonesia',
      region: 'Jakarta',
      dob: new Date('2001-01-01'),
    } as Partial<AccountDocuments>;

    jest.spyOn(mockUsersService, 'register').mockReturnValue(userData);
    const result = await userController.register(createUsersDto);
    expect(mockUsersService.register).toBeCalled();
    expect(mockUsersService.register).toBeCalledWith(createUsersDto);

    expect(result).toEqual(userData);
  });

  // UNIT TEST - UPDATE USER
  it('update => user should be updated', async () => {
    const id = 1;

    const updateUserDto: UserDto = {
      firstName: 'updated',
      lastName: 'Last Name',
      area: 'Asia',
      country: 'Indonesia',
      region: 'Jakarta',
      dob: '2001-01-01',
    } as UserDto;

    const userData = {
      id: 1,
      firstName: 'updated',
      lastName: 'Last Name',
      area: 'Asia',
      country: 'Indonesia',
      region: 'Jakarta',
      dob: new Date('2001-01-01'),
    } as Partial<AccountDocuments>;

    jest.spyOn(mockUsersService, 'update').mockReturnValue(userData);
    const result = await userController.update(id, updateUserDto);

    expect(mockUsersService.update).toBeCalled();
    expect(mockUsersService.update).toBeCalledWith(id, updateUserDto);
    expect(result).toEqual(userData);
  });

  // UNIT TEST - DELETE USER
  it('Delete => user should be deleted', async () => {
    const id = 1;

    jest.spyOn(mockUsersService, 'delete').mockReturnValue(null);
    const result = await userController.delete(id);

    expect(mockUsersService.delete).toBeCalled();
    expect(mockUsersService.delete).toBeCalledWith(id);
    expect(result).toBe(null);
  });
});
