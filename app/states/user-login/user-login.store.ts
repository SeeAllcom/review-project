import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import {
  UserRoleStorageKey,
  UserState,
  UserTokenStorageKey,
} from '../../shared/helpers/auth-user.helper';
import { CookieService } from 'ngx-cookie';

function createInitialState(isAuthenticated: boolean, userRolesEnum: string | any): UserState {
  return {
    isLoggedIn: isAuthenticated,
    userRole: userRolesEnum,
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'isLoggedIn'})

export class UserLoginStore extends Store<UserState> {
  constructor(cookie: CookieService) {
    if (!cookie.get(UserTokenStorageKey) || !cookie.get(UserRoleStorageKey)) {
      cookie.remove(UserTokenStorageKey);
      cookie.remove(UserRoleStorageKey);
    }
    super(createInitialState(!!cookie.get(UserTokenStorageKey), cookie.get(UserRoleStorageKey)));
  }
}
