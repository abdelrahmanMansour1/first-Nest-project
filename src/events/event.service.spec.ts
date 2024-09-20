import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as paginator from './../pagination/paginator';
import { EventsService } from './events.service';
import { Event } from './event.entity';

jest.mock('./../pagination/paginator');

describe('EventsService', () => {
  let eventsService: EventsService;
  let eventRepository: Repository<Event>;
  let selectQb;
  let deleteQb;
  let mockedPaginate;

  beforeEach(async () => {
    mockedPaginate = paginator.paginate as jest.Mock;

    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      where: jest.fn(),
      execute: jest.fn(),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            delete: jest.fn(),
            where: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('updateEvent', () => {
    it('should update event', async () => {
      const repoSpy = jest
        .spyOn(eventRepository, 'save')
        .mockResolvedValue({ id: 1 } as Event);

      expect(
        eventsService.updateEvent(new Event({ id: 1 }), {
          name: 'updated event',
        }),
      ).resolves.toEqual({ id: 1 });
      expect(repoSpy).toBeCalledWith({ id: 1, name: 'updated event' });
    });
  });

  describe('deleteEvent', () => {
    it('should delete event', async () => {
      const createQbSpy = jest.spyOn(eventRepository, 'createQueryBuilder');
      const deleteSpy = jest
        .spyOn(selectQb, 'delete')
        .mockReturnValue(deleteQb);
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      expect(eventsService.deleteEvent(1)).resolves.toBe(undefined);

      expect(createQbSpy).toHaveBeenCalledTimes(1);
      expect(createQbSpy).toHaveBeenCalledWith('e');

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = id', { id: 1 });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return a list of paginated events', () => {
      const orderBySpy = jest
        .spyOn(selectQb, 'orderBy')
        .mockReturnValue(selectQb);
      const leftJoinSpy = jest
        .spyOn(selectQb, 'leftJoinAndSelect')
        .mockReturnValue(selectQb);
      const whereSpy = jest.spyOn(selectQb, 'where').mockReturnValue(selectQb);

      mockedPaginate.mockResolvedValue({
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
        data: [],
      });

      expect(
        eventsService.getEventsAttendedByUserPaginated(500, {
          limit: 1,
          currentPage: 1,
        }),
      ).resolves.toEqual({
        data: [],
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
      });

      expect(orderBySpy).toHaveBeenCalledTimes(1);
      expect(orderBySpy).toHaveBeenCalledWith('e.id', 'DESC');

      expect(leftJoinSpy).toHaveBeenCalledTimes(1);
      expect(leftJoinSpy).toHaveBeenCalledWith('e.attendees', 'a');

      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('a.userId = :userId', {
        userId: 500,
      });

      expect(mockedPaginate).toHaveBeenCalledTimes(1);
      expect(mockedPaginate).toHaveBeenCalledWith(selectQb, {
        currentPage: 1,
        limit: 1,
      });
    });
  });
});
