export class DomainError {
  constructor(public entityName: string, public message: string) {
    this.entityName = entityName;
    this.message = message;
  }

  getFullMessage() {
    return `${this.entityName}: ${this.message}`;
  }
}
