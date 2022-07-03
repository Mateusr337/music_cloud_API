import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaConnection } from '../src/infra/database/prisma-connection';
import { DomainExceptionFilter } from '../src/infra/http/domain-exception.filter';
import { SignUpDto } from '../src/users/dto/sign-up.dto';
import { AuthProviders } from '../src/users/entities/user.entity';
import { UsersRepository } from '../src/users/repositories/users.repository';
import { UsersModule } from '../src/users/users.module';

describe('Sign Up Test (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
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
});
