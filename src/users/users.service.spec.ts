import { Test, TestingModule } from '@nestjs/testing';
import { DomainError } from './../domain/domain-error';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthProviders } from './entities/user.entity';
import { UsersMemoryRepository } from './repositories/users-memory.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let database: UsersMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useClass: UsersMemoryRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    database = module.get(UsersRepository);
    database.resetDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a valid user', async () => {
    const signUpData = new SignUpDto(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );

    return expect(() => service.signUp(signUpData)).resolves;
  });

  it('should no sign up an user with duplicate email', async () => {
    const signUpData = new SignUpDto(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );

    await database.create(signUpData);
    await expect(() => service.signUp(signUpData)).rejects.toBeInstanceOf(
      DomainError,
    );
  });
});
