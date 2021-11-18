import { RequestBodyAbonementInterface } from '../../../helpers/abonements.helper';
import { UserInterface } from '../../../helpers/auth-user.helper';
import { EstablishmentLocationInterface } from './network.helper';
import { UserOrdersHistoryProductData } from '../../dialogs/user-history/user-history.helper';

export interface NetworkHistoryOrders {
  order: NetworkHistoryOrder[];
}

export interface NetworkHistoryOrderData {
  created_at: string;
  data: UserOrdersHistoryProductData[];
  id: number;
  payment_bonuses: number;
  is_spoiled: number;
  paid_at: string;
  price: string;
  price_ad: string;
  price_at: string;
  bonus: string;
  updated_at: string;
  user: UserInterface;
}

export interface NetworkHistoryOrder {
  current_page: number;
  data: NetworkHistoryOrderData[];
  first_page_url: string;
  from: number;
  last_page: string;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: string;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface NetworkHistoryUsedAbonements {
  usedAbonements: NetworkHistoryUsedAbonement[];
}

export interface NetworkHistoryUsedAbonementData {
  coffee_shop: EstablishmentLocationInterface;
  created_at: string;
  data: UserOrdersHistoryProductData[];
  id: number;
  paid_at: string;
  price_ad: string;
  price: string;
  bonus: string;
  updated_at: string;
  user: UserInterface;
  shop_opened_abonement: boolean;
  used: boolean;
}

export interface NetworkHistoryPresents {
  presentAbonements: NetworkHistoryPresentData[];
}

export interface NetworkHistoryPresent {
  data: NetworkHistoryPresentData[];
  total: number;
}

export interface NetworkHistoryPresentData {
  created_at: string;
  updated_at: string;
  data: UserOrdersHistoryProductData[];
  id: number;
  user_recipient: {
    email: string;
    id: number;
    name: string;
  };
  user_sender: {
    email: string;
    id: number;
    name: string;
  };
}

export interface NetworkHistoryUsedAbonement {
  current_page: number;
  data: NetworkHistoryUsedAbonementData[];
  first_page_url: string;
  from: number;
  last_page: string;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: string;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface AllHistoryTabsInterface {
  usedAbonements: NetworkHistoryUsedAbonement;
  orders: NetworkHistoryOrder;
  presentAbonements: NetworkHistoryPresent;
}
