import { DomainError } from '../domain/domain-error';
import { AuthProviders } from '../entities/user.entity';

export class LoginDto {
  constructor(
    public email: string,
    public password: string,
    public provider: AuthProviders,
  ) {
    if (!this.email) {
      throw new DomainError(LoginDto.name, 'email is required');
    }

    if (this.provider === AuthProviders.EMAIL && !this.password) {
      throw new DomainError(LoginDto.name, 'password is required');
    }
  }
}
