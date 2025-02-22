import {ImputationMois} from './imputation-mois.interface';

export interface Agent {
  id: number;
  nom: string;
  imputationsParMois: ImputationMois[];
}
