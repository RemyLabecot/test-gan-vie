import {Project} from '../interface/project.interface';

export type CraGeneratorState = {
  projects: Project[];
  currentSelectedAgentId: number;
  currentSelectedProjectId: number;
  currentMonth: string;
  holidayMode: boolean;
  refreshCalendar: boolean;
};
