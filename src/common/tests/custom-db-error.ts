export class CustomDbError extends Error {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
}
