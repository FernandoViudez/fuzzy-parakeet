import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../repository/user.repository';
import { User } from '../schema/types/user.type';
import { Role } from '../../common/enum/role.enum';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomDbError } from '../../common/tests/custom-db-error';
import { BadRequestException } from '@nestjs/common';

describe('Auth service should: ', () => {
  let module: TestingModule;
  let service: AuthService;
  let userMock: Partial<User>;
  let mockReq: LoginDto;

  beforeEach(async () => {
    userMock = {
      email: 'test@gmail.com',
      password: 'asd',
      role: Role.admin,
      userId: 'usr_123',
    };
    mockReq = {
      email: 'test@gmail.com',
      password: 'asd',
    };

    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findWithPassword: jest.fn().mockResolvedValue(userMock),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt-fake'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  test('throw error if user is not found during login', async () => {
    module.get<UserRepository>(UserRepository).findWithPassword = jest
      .fn()
      .mockResolvedValue(null);

    const promise = service.login(mockReq);

    await expect(promise).rejects.toThrow(
      'Unauthorized: Incorrect credentials',
    );
  });

  test('throw error if password is invalid during login', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

    const promise = service.login(mockReq);

    await expect(promise).rejects.toThrow(
      'Unauthorized: Incorrect credentials',
    );
  });

  test('pass and login', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

    const jwt = await service.login(mockReq);

    expect(jwt).toBe('jwt-fake');
  });

  test('throw error if role provided is invalid', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashed-password');

    const promise = service.register(
      {
        age: 18,
        email: 'test@gmail.com',
        name: 'test',
        password: 'asd',
        role: 'asd' as any,
      },
      {} as any, // user session (in case of admin)
    );

    await expect(promise).rejects.toThrow(
      `Data inconsistency: user role undefined is not a valid value`,
    );
  });

  test('throw error if user already exists', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashed-password');

    module.get<UserRepository>(UserRepository).create = jest
      .fn()
      .mockRejectedValue(new CustomDbError('SequelizeUniqueConstraintError'));

    const promise = service.register({
      age: 18,
      email: 'test@gmail.com',
      name: 'test',
      password: 'asd',
      role: Role.admin,
    });

    await expect(promise).rejects.toThrow(
      new BadRequestException('User already exists, try to login instead'),
    );
  });

  test('pass and register a new user with role "user" if admin is not the request caller', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashed-password');

    await service.register({
      age: 18,
      email: 'test@gmail.com',
      name: 'test',
      password: 'asd',
    });

    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledTimes(1);
    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledWith({
      age: 18,
      email: 'test@gmail.com',
      name: 'test',
      password: 'hashed-password',
      role: Role.user,
    });
  });

  test('pass and register a new user with role "admin" if admin is the request caller and admin role option was provided', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashed-password');

    await service.register(
      {
        age: 18,
        email: 'test@gmail.com',
        name: 'test',
        password: 'asd',
        role: Role.admin,
      },
      { role: Role.admin } as any,
    );

    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledTimes(1);
    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledWith({
      age: 18,
      email: 'test@gmail.com',
      name: 'test',
      password: 'hashed-password',
      role: Role.admin,
    });
  });

  test('pass and register a new user with role "user" if admin is the request caller and user role option was provided', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashed-password');

    await service.register(
      {
        age: 18,
        email: 'test@gmail.com',
        name: 'test',
        password: 'asd',
        role: Role.user,
      },
      { role: Role.admin } as any,
    );

    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledTimes(1);
    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledWith({
      age: 18,
      email: 'test@gmail.com',
      name: 'test',
      password: 'hashed-password',
      role: Role.user,
    });
  });

  test('pass and register a new user with role "user" if admin is the request caller and no role option was provided', async () => {
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'hashed-password');

    await service.register(
      {
        age: 18,
        email: 'test@gmail.com',
        name: 'test',
        password: 'asd',
      },
      { role: Role.admin } as any,
    );

    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledTimes(1);
    expect(
      module.get<UserRepository>(UserRepository).create,
    ).toHaveBeenCalledWith({
      age: 18,
      email: 'test@gmail.com',
      name: 'test',
      password: 'hashed-password',
      role: Role.user,
    });
  });
});
