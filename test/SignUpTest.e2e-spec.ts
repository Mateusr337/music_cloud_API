import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { IUsersRepository } from '../src/users/iusers.repository';
import { SignUpDto } from './../src/users/dto/sign-up.dto';
import { UsersModule } from './../src/users/users.module';

describe('Sign Up Test (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should sign up given valid credentials', async () => {
    const usersRepository = app.select(UsersModule).get(IUsersRepository);
    const signUpDto = new SignUpDto();

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send(signUpDto);
    const createdUser = await usersRepository.findByEmail(signUpDto.email);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(createdUser).not.toEqual(null);
  });
});
