import { Module } from '@nestjs/common';
import { PrismaConnection } from '../infra/database/prisma-connection';
import { UsersDatabaseRepository } from './repositories/users-database.repository';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaConnection,
    { provide: UsersRepository, useClass: UsersDatabaseRepository },
  ],
})
export class UsersModule {}
