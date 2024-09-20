import { Event } from './event.entity';

test('Event should be intialized through constructor', () => {
  const event = new Event({
    name: 'Test Event',
    description: 'Test event description',
  });

  expect(event).toEqual({
    name: 'Test Event',
    description: 'Test event description',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    attendeeCount: undefined,
    attendeeAccepted: undefined,
    attendeMaybe: undefined,
    attendeeRejected: undefined,
    event: undefined,
  });
});
