import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './iusers.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}
}
