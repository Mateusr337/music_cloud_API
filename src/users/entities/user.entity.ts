import { DomainError } from '../../domain/domain-error';

export class User {
  constructor(
    public name: string,
    public email: string,
    public password: string | null,
    public provider: AuthProviders,
  ) {
    if (!this.name || typeof this.name !== 'string') {
      throw new DomainError(User.name, 'name is required and must be a string');
    }

    if (!this.email || typeof this.email !== 'string') {
      throw new DomainError(
        User.name,
        'email is required and must be a string',
      );
    }

    if (!this.email || typeof this.email !== 'string') {
      throw new DomainError(
        User.name,
        'email is required and must be a string',
      );
    }

    if (this.provider === AuthProviders.EMAIL) {
      if (!this.password || typeof this.password !== 'string') {
        throw new DomainError(
          User.name,
          'password is required and must be a string when User was provided by email',
        );
      }

      if (this.password.length <= 7) {
        throw new DomainError(
          User.name,
          'password must have length greater than 7 when User was provided by email',
        );
      }
    }
  }
}

export enum AuthProviders {
  EMAIL = 'EMAIL',
  GITHUB = 'GITHUB',
}
