export class User {
  private id: string;
  private jwt: string;

  constructor(id: string, jwt: string) {
    this.id = id;
    this.jwt = jwt;
  }

  getId() {
    return this.id;
  }

  getJWT() {
    return this.jwt;
  }
}


