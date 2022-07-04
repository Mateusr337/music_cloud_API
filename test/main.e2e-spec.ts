import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { LoginDto } from '../src/dto/login.dto';
import { SignUpDto } from '../src/dto/sign-up.dto';
import { AuthProviders, User } from '../src/entities/user.entity';
import { PrismaConnection } from '../src/infra/database/prisma-connection';
import { DomainExceptionFilter } from '../src/infra/http/domain-exception.filter';
import { UsersRepository } from '../src/repositories/users.repository';
import { UsersModule } from '../src/users/users.module';

describe('E2E tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();

    const prismaConnection = app.get<PrismaConnection>(PrismaConnection);
    await prismaConnection.user.deleteMany({});
  });

  it('should sign up given valid credentials', async () => {
    const usersRepository = app.get<UsersRepository>(UsersRepository);
    const signUpData = new SignUpDto(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(signUpData);
    const createdUser = await usersRepository.findByEmail(signUpData.email);

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(createdUser).not.toEqual(null);
  });

  it('should login given valid credentials', async () => {
    const user = new User(
      'Fulano',
      'fulano@email.com',
      '12345678',
      AuthProviders.EMAIL,
    );
    const usersRepository = app.get<UsersRepository>(UsersRepository);
    await usersRepository.create(user);

    const loginDto = new LoginDto(user.email, user.password, user.provider);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body.name).toEqual(user.name);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.provider).toEqual(user.provider);
    expect(response.body.password).toBeUndefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
