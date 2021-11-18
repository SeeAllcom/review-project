import { AreaInterface, Region, RegionWithData } from '../../../helpers/cities.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export enum Applications {
  Network = 'network',
}

export const NETWORK_MAIN_ROUTE = `/${Applications.Network}`;

export const APPLICATIONS_ROUTE: { [key in Applications]: string } = {
  [Applications.Network]: NETWORK_MAIN_ROUTE,
};

export interface EstablishmentLocationInterface {
  id: number;
  address: string;
  img: any;
  region_id: number;
  region: Region;
}

export interface NetworksEstablishments {
  areas: NetworkEstablishments[];
}

export interface NetworkEstablishments {
  country_id: number;
  created_at: string;
  id: number;
  name: string;
  name_en: string;
  regions: NetworkEstablishmentsRegions[];
  token_country: string;
  token_id: string;
  updated_at: string;
}

export interface NetworkEstablishmentsRegions {
  area_id: number;
  coffee_shops: CoffeeShopInterface[];
  created_at: string;
  id: number;
  name: string;
  name_en: string;
  token_area: string;
  token_id: string;
  updated_at: string;
}

export interface CoffeeShopInterface {
  address: string;
  created_at: string;
  id: number;
  img: any;
  pivot: NetworkPivotInterface;
  region: Region;
  updated_at: number;
}

export interface NetworkPivotInterface {
  coffee_shop_id: number;
  worker_id: number;
}

export interface WorkerInterface {
  coffee_shops: CoffeeShopInterface[];
  id: number;
  email: string;
  confirmed_email: boolean;
  password: string;
  password_confirmation: string;
  name: string;
  shop: number;
  pivot: NetworkPivotInterface;
  created_worker: {
    created_at: string,
    email: string,
    id: number,
    name: string,
    updated_at: string,
  };
  updated_at: string;
  created_at: string;
}

export interface WorkersInterface {
  workers: WorkerInterface[];
}

const categoriesTranslateKeys: any = {
  HitSale: marker('Хіт Продажів'),
  CoffeeCard: marker('Кавова карта'),
  Teas_HotDrinks: marker('Чаї/гарячі напої'),
  ColdDrinks: marker('Холодні напої'),
  CarbonatedDrinks_Water: marker('Газовані напої (вода)'),
  Desserts: marker('Десерти'),
  Salads: marker('Салати'),
  Lunch: marker('Ланч'),
  Additives: marker('Добавки'),
  Cocktails: marker('Коктейлі'),
  Smoothies: marker('Смузі'),
  Fresh: marker('Фреши'),
  Lemonade: marker('Лимонади'),
  IceCream: marker('Морозиво'),
  Another: marker('Інше'),
};

export function getLocalizationCategoriesKey(name: string) {
  return categoriesTranslateKeys[name];
}
