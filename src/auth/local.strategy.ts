import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly Logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      this.Logger.debug(`User not found: ${username}`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.Logger.debug(`Invalid password for user: ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }
}
