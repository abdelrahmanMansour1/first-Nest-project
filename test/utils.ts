import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Connection } from 'typeorm';
import { AuthService } from './../src/auth/auth.service';
import { User } from './../src/auth/user.entity';

export const tokenForUser = (
  app: INestApplication,
  user: Partial<User>,
): string => {
  return app.get(AuthService).getUserToken(user as User);
};

export const loadFixtures = async (
  connection: Connection,
  sqlFileName: string,
) => {
  const sql = fs.readFileSync(
    path.join(__dirname, 'fixtures', sqlFileName),
    'utf8',
  );

  const queryRunner = connection.driver.createQueryRunner('master');

  for (const c of sql.split(';')) {
    await queryRunner.query(c);
  }
};
