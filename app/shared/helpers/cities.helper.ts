import { NetworkBonuses } from './networks.helper';

export enum EstablishmentsTypeEnum {
  All = 'all',
  Bonuses = 'bonuses',
  Selected = 'selected',
}

export interface AreasInterface {
  areas: AreaInterface[];
}

export interface AreaInterface {
  country_id: number;
  id: number;
  img: {
    path: string;
  };
  name: string;
  name_en: string;
  regions: Region[];
  areas?: AreaInterface[];
  data?: AreaInterface;
}

export interface Region {
  id: number;
  name: string;
  name_en: string;
  networks: RegionsNetworkInterface[];
}

export interface RegionWithData {
  data: Region;
  error?: string;
}

export interface RegionWithEstablishments {
  data: {
    area_id: number;
    id: number;
    name: string;
    name_en: string;
    networks: RegionsNetworkInterface[];
  };
  message: string;
}

export interface RegionsNetworkInterface {
  avatar: string;
  bonuses: NetworkBonuses;
  percent_bonus: number;
  created_at: string;
  description: string;
  id: number;
  inaccessible: boolean;
  name: string;
  slug: string;
  updated_at: string;
  user_id: string;
}

export interface RegionsInterface {
  regions: RegionWithData[];
}
