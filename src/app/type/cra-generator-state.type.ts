import {Agent} from '../interface/agent.interface';
import {Project} from '../interface/project.interface';

export type CraGeneratorState = {
  projects: Project[];
  currentSelectedAgentId: number;
  currentSelectedProjectId: number;
};
