import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  constructor(
    @Inject('APP_NAME')
    private readonly appName: string,
    @Inject('MESSAGE')
    private readonly message: string,
  ) {}
  getHello(): string {
    console.log(process.env.DB_USER);
    return `こんにちは世界! from ${this.appName}, ${this.message}`;
  }
}
