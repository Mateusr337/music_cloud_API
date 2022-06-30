import { IUsersRepository } from './iusers.repository';

export class UsersRepository implements IUsersRepository {
  private users: { id: string }[] = [];

  constructor() {
    this.users = [];
  }

  create() {
    this.users.push({ id: Date.now().toString() });
    console.log(this.users);
  }
}
