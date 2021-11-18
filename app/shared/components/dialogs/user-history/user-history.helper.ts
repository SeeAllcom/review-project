import { NetworkKeysInterface } from '../../../helpers/networks.helper';
import { UserInterface } from '../../../helpers/auth-user.helper';
import { EstablishmentLocationInterface } from '../../owner-establishment/helpers/network.helper';
import { RequestBodyAbonementInterface, SupplementsOptionInterface } from '../../../helpers/abonements.helper';

export interface UserOrdersHistory {
  current_page: number;
  data: UserOrdersHistoryData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface UserOrdersHistoryData {
  created_at: string;
  data: UserOrdersHistoryProductData[];
  id: number;
  network: NetworkKeysInterface;
  paid_at: string;
  is_spoiled: number;
  payment_bonuses: number;
  price_ad: string;
  price_at: string;
  price_profit: string;
  price: string;
  price_commission: string;
  bonus: string;
  present: boolean;
  updated_at: string;
}

export interface UserOrdersHistoryProductData {
  id: string;
  product_id: string;
  product_name: string;
  quantity: string;
  supplement_options: SupplementsOptionInterface[];
}

export interface UserPresentHistoryData {
  created_at: string;
  updated_at: string;
  data: UserOrdersHistoryProductData[];
  id: number;
  network: NetworkKeysInterface;
  you_gave_present: boolean;
  user: UserInterface;
}

export interface UserHistory {
  networks: NetworkKeysInterface[];
  orders: UserOrdersHistory;
  usedAbonements: UserUsedAbonementsHistory;
  presentAbonements: UserPresentAbonementsHistory;
}

export interface UserUsedAbonementsHistory {
  current_page: number;
  data: UserUsedAbonementsHistoryData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface UserPresentAbonementsHistory {
  current_page: number;
  data: UserPresentHistoryData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface UserUsedAbonementsHistoryData {
  created_at: string;
  data: UserOrdersHistoryProductData[];
  coffee_shop: EstablishmentLocationInterface;
  id: number;
  network: NetworkKeysInterface;
  shop_opened_abonement: boolean;
  token: string;
  updated_at: string;
  used: boolean;
}
