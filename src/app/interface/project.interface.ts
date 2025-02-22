import {Agent} from './agent.interface';

export interface Project {
  id: number;
  name: string;
  agents: Agent[];
}
