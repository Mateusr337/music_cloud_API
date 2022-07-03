import { Injectable } from '@nestjs/common';
import { DomainError } from './../domain/domain-error';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password, provider } = signUpDto;

    const user = new User(name, email, password, provider);
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new DomainError(
        User.name,
        'cannot create an user with this email, emails must be unique',
      );
    }
    await this.usersRepository.create(user);
  }
}
