import { EntityState } from '@datorama/akita';
import { AuthTypes } from '../components/login/state/auth-header.model';
import { BehaviorSubject } from 'rxjs';

export const userData$ = new BehaviorSubject<UserInterface>(null);

export type AuthHeaderState = EntityState<AuthTypes>;

export const UserTokenStorageKey: string = 'auth-token';
export const UserRefreshTokenStorageKey: string = 'refresh-token';
export const UserRoleStorageKey: string = 'auth-role';

export enum UserRolesEnum {
  Owner = 'main_cafe',
  User = 'user',
  Worker = 'worker',
}

export interface UserState {
  isLoggedIn: boolean;
  userRole: string;
}

export interface UserLogin {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expired_in: number;
  token_type: string;
  role: UserRolesEnum;
  user: UserInterface;
}

export interface RefreshTokenLogin {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expired_in: number;
  token_type: string;
  error?: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  message: string;
}

export interface UserPasswordRecovery {
  code: string;
  password: string;
  password_confirmation: string;
}

export interface UserInterface {
  created_at?: string;
  email?: string;
  avatar?: string;
  password?: string;
  password_confirmation?: string;
  privacy_policy?: any;
  email_verified_at?: any;
  id?: number;
  name?: string;
  updated_at?: string;
}

export interface ChangingPasswordInterface {
  password: string;
  password_confirmation: string;
  old_password: string;
}

export interface IPData {
  ip: string;
  isp: string;
  org: string;
  hostname: string;
  latitude: number;
  longitude: number;
  postal_code: string;
  city: string;
  country_code: string;
  country_name: string;
  continent_code: string;
  continent_name: string;
  region: string;
  district: string;
  timezone_name: string;
  connection_type: string;
  asn_number: number;
  asn_org: string;
  asn: string;
  currency_code: string;
  currency_name: string;
  success: boolean;
  premium: boolean;
}
