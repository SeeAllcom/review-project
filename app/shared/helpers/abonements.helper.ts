import { UserSideNetworkInterface } from './networks.helper';
import { ProductInterface } from './products.helper';
import { UserInterface } from './auth-user.helper';
import { BehaviorSubject } from 'rxjs';
import { UserOrdersHistoryProductData } from '../components/dialogs/user-history/user-history.helper';

export const abonementWriteOff$ = new BehaviorSubject<boolean>(false);
export const needUpdateAbonements$ = new BehaviorSubject<boolean>(false);

export interface EstablishmentWithAbonementsInterface {
  networks: EstablishmentWithAbonementsData[];
}

export interface EstablishmentWithAbonementsData {
  avatar: string;
  created_at?: string;
  id: number;
  name: string;
  slug: string;
  description?: string;
  user_id: number;
}

export interface MyAbonementsPageInterface {
  network: UserSideNetworkInterface;
  abonements: AbonementInterface[];
}

export interface AbonementInterface {
  product_name: string;
  product_price: string;
  product: ProductInterface;
  quantity: number;
  supplements: AbonementSupplementInterface[];
}

export interface RequestBodyAbonementInterface {
  product_name: string;
  product_price: number;
  product?: ProductInterface;
  quantity: number;
  quantityForOrder?: number;
  supplement: AbonementSupplementInterface;
}

export interface SupplementsOptionInterface {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface AbonementSupplementInterface {
  id: number;
  product_price: number;
  deleted?: boolean;
  quantity: number;
  supplement_options: SupplementsOptionInterface[];
}

export interface AbonementsForOrder {
  abonements: RequestBodyAbonementInterface[];
  send_mail?: boolean;
  message?: string;
}

export interface AbonementQrCodeInterface {
  qrCode: string;
  usedAbonement: {
    id: number;
    token: string;
    updated_at: string;
    created_at: string;
    data: AbonementQrCodeDataInterface[]
  };
}

export interface AbonementQrCodeDataInterface {
  product_id: number;
  product_name: string;
  quantity: number;
  supplement_options: SupplementsOptionInterface[];
}

export interface UsedAbonementsInterface {
  usedAbonement: UsedAbonementInterface;
  message?: string;
}

export interface UsedAbonementInterface {
  created_at: string;
  data: UserOrdersHistoryProductData[];
  id: string;
  shop_opened_abonement: boolean;
  token: string;
  updated_at: string;
  used: boolean;
  user: UserInterface;
}
