import {AllocationByMonth} from './allocation-by-month.interface';

export interface Agent {
  id: number;
  name: string;
  allocationsByMonth: AllocationByMonth[];
}
