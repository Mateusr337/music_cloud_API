import { Module } from '@nestjs/common';
import { IUsersRepository } from './iusers.repository';
import { UsersMemoryRepository } from './users-memory.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: IUsersRepository, useClass: UsersMemoryRepository },
  ],
})
export class UsersModule {}
