import { Injectable } from '@angular/core';
import { AuthTabsTypeEnum } from './auth-header.model';
import { Store, StoreConfig } from '@datorama/akita';
import { AuthHeaderState } from '../../../helpers/auth-user.helper';

function createInitialState(): AuthHeaderState {
  return { activeAuthTab: AuthTabsTypeEnum.SignUp };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth-type' })
export class AuthHeaderStore extends Store<AuthHeaderState> {

  constructor() {
    super(createInitialState());
  }

  setTab(tab: AuthTabsTypeEnum) {
    this.update({activeAuthTab: tab});
  }

  setDefault() {
    this.update(createInitialState());
  }

}
