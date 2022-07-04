import { AuthProviders } from '../entities/user.entity';

export class LoginDto {
  constructor(
    public email: string,
    public password: string,
    public provider: AuthProviders,
  ) {}
}
