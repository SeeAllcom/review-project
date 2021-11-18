import { CoffeeShopInterface } from '../components/owner-establishment/helpers/network.helper';
import { ProductInterface } from './products.helper';

export interface NetworkKeysInterface {
  id: number;
  slug: string;
  name: string;
  work_schedule: string;
  instagram: string;
  facebook: string;
  avatar: any;
  description: string;
  inaccessible: boolean;
  created_at: string;
  updated_at: string;
  payment_id: string;
  payment_type: string;
  user_id: number;
  percent_bonus: number;
  message: string;
  chain_cafe: NetworkKeysInterface;
}

export interface NetworkPaymentErrors {
  id: number;
  network_id: number;
  order_id: number;
  value: string;
}

export interface NetworkInterface {
  network: NetworkKeysInterface;
  coffee_shop?: CoffeeShopInterface;
  payment_errors?: NetworkPaymentErrors[];
}

export interface NetworkBonuses {
  value: string;
}

export interface UserSideNetwork {
  data: UserSideNetworkInterface;
}

export interface UserSideNetworkInterface {
  avatar: string;
  bonuses: NetworkBonuses;
  percent_bonus: number;
  coffee_shops: CoffeeShopInterface[];
  created_at: string;
  description: string;
  id: number;
  name: string;
  products: ProductInterface[];
  slug: string;
  updated_at: string;
  user_id: number;
  work_schedule: string;
  instagram: string;
  facebook: string;
}
