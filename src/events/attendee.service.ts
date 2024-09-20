import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { CreateAttendeeDto } from './input/create-attendee.dto';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return this.attendeeRepository.find({ where: { event: { id: eventId } } });
  }

  public async findOnebyEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return await this.attendeeRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOnebyEventIdAndUserId(eventId, userId)) ?? new Attendee();

    attendee.userId = userId;
    attendee.eventId = eventId;
    attendee.answer = input.answer;

    return await this.attendeeRepository.save(attendee);
  }
}
