import { UserLoginStore } from './user-login.store';
import { Injectable } from '@angular/core';

@Injectable()
export class UserLoginService {

  constructor(private userLoginStore: UserLoginStore) {
  }

  updateUserLoggedIn(state: boolean) {
    this.userLoginStore.update({isLoggedIn: state});
  }
}
