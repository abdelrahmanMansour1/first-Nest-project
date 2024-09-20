export class ListEvents {
  when?: WhenEventFilter = WhenEventFilter.All;
  page: number = 1;
}

export enum WhenEventFilter {
  All = 1,
  Today = 2,
  Tommorow = 3,
  ThisWeek,
  NextWeek,
}
