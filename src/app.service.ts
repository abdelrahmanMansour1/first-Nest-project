import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('APP_NAME')
    private readonly appName: string,
  ) {}
  getHello(): string {
    return `Hello World! from ${this.appName}`;
  }
}
