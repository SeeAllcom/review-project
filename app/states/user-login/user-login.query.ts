import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UserLoginStore } from './user-login.store';
import { UserRolesEnum, UserState } from '../../shared/helpers/auth-user.helper';

@Injectable({providedIn: 'root'})
export class UserLoginQuery extends Query<UserState> {
  isLoggedIn = () => this.getValue().isLoggedIn;

  isUserLoggedIn$ = this.select((userState) => userState.isLoggedIn && userState.userRole === UserRolesEnum.User);
  isUserLoggedIn = () => this.getValue().isLoggedIn && this.getValue().userRole === UserRolesEnum.User;

  isOwnerLoggedIn$ = this.select((userState) => {
    return userState.isLoggedIn && userState.userRole === UserRolesEnum.Owner;
  });
  isOwnerLoggedIn = () => this.getValue().isLoggedIn && this.getValue().userRole === UserRolesEnum.Owner;

  isWorkerLoggedIn$ = this.select((userState) => userState.isLoggedIn
    && userState.userRole === UserRolesEnum.Worker);
  isWorkerLoggedIn = () => this.getValue().isLoggedIn && this.getValue().userRole === UserRolesEnum.Worker;

  constructor(protected userLoginStore: UserLoginStore) {
    super(userLoginStore);
  }
}
