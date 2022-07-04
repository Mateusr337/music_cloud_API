import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';
import { AuthProviders } from '../entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto): Promise<UserDto | null> {
    const { email, password, provider } = loginDto;

    const user = await this.usersService.findByEmail(email);

    if (provider === AuthProviders.EMAIL && user?.password === password) {
      delete user.password;
      return user;
    }

    return null;
  }
}
