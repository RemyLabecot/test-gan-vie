import {Agent} from './agent.interface';

export interface Project {
  id: number;
  nom: string;
  agents: Agent[];
}
