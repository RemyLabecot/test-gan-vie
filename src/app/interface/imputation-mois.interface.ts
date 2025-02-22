import {ImputationJour} from './imputation-jour.interface';

export interface ImputationMois {
  mois: string;
  imputations: ImputationJour[];
}
