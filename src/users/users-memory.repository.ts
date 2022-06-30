import { User } from './entities/user.entity';
import { IUsersRepository } from './iusers.repository';

export class UsersMemoryRepository implements IUsersRepository {
  private users: User[] = [];

  constructor() {
    this.users = [];
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async create(user: User) {
    this.users.push(user);
  }
}
