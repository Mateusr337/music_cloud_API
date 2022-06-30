import { Module } from '@nestjs/common';
import { IUsersRepository } from './iusers.repository';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
})
export class UsersModule {}
