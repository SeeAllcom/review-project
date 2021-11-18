import { ProductInterface } from '../../../helpers/products.helper';

export enum AbonementsTemplates {
  abonementsTemplate = 'abonementsTemplate',
  empty = 'empty',
  loading = 'loading',
  errorTemplate = 'errorTemplate',
}

export enum AbonementStatus {
  DidNotStart = 'DidNotStart',
  Started = 'Started',
  IsOver = 'IsOver',
}

export interface NetworkAbonementRequestBody {
  price: number;
  quantity: number;
  description: string;
  date_start: string;
  date_end: string;
}

export interface NetworkAbonementResponse {
  product: ProductInterface;
  id: number;
  price: number;
  price_old: number;
  quantity: number;
  description: string;
  date_start: string;
  date_end: string;
}
