import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dto/login.dto';
import { AuthProviders, User } from '../entities/user.entity';
import { UsersMemoryRepository } from '../repositories/users-memory.repository';
import { UsersRepository } from '../repositories/users.repository';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('UsersService', () => {
  let service: AuthService;
  let database: UsersMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        { provide: UsersRepository, useClass: UsersMemoryRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    database = module.get(UsersRepository);
    database.resetDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login given valid credentials', async () => {
    const existingUser = new User(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );
    await database.create(existingUser);

    const loginDto = new LoginDto(
      existingUser.email,
      existingUser.password,
      existingUser.provider,
    );
    const user = await service.login(loginDto);

    expect(user.name).toEqual(existingUser.name);
    expect(user.email).toEqual(existingUser.email);
    expect(user.provider).toEqual(existingUser.provider);
    expect(user.password).toBeUndefined();
  });

  it('should not login given invalid credentials', async () => {
    const loginDto = new LoginDto('', '', AuthProviders.EMAIL);
    const user = await service.login(loginDto);
    expect(user).toBeNull();
  });

  it('should not login given invalid provider', async () => {
    const existingUser = new User(
      'Fulano',
      'fulano@email.com',
      '',
      AuthProviders.GITHUB,
    );
    await database.create(existingUser);
    const loginDto = new LoginDto(
      existingUser.email,
      existingUser.password,
      existingUser.provider,
    );

    const user = await service.login(loginDto);
    expect(user).toBeNull();
  });
});
