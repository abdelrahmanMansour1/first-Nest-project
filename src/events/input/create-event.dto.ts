import { IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'The name length is wrong' })
  name: string;

  @Length(10, 500, { message: 'The description length is wrong' })
  description: string;

  when?: Date;

  @Length(10, 100, { message: 'The address length is wrong' })
  address: string;
}
