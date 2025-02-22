import {AllocationByDay} from './allocation-by-day.interface';

export interface AllocationByMonth {
  mois: string;
  allocationsByDay: AllocationByDay[];
}
