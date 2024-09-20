import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AttendeeService } from './attendee.service';
import { CreateAttendeeDto } from './input/create-attendee.dto';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/user.entity';
import { AuthGuardJwt } from './../auth/auth-guard.jwt';

@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendenceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeeService: AttendeeService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return await this.eventsService.getEventsAttendedByUserPaginated(user.id, {
      limit: 6,
      currentPage: page,
    });
  }

  @Get('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeeService.findOnebyEventIdAndUserId(
      eventId,
      user.id,
    );

    if (!attendee) {
      throw new NotFoundException(
        `Attendee not found for user ${user.id} at event ${eventId}`,
      );
    }

    return attendee;
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return await this.attendeeService.createOrUpdate(input, eventId, user.id);
  }
}
