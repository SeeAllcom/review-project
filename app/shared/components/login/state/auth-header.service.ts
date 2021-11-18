import { Injectable } from '@angular/core';
import { AuthHeaderStore } from './auth-header.store';
import { AuthTabsTypeEnum } from './auth-header.model';

@Injectable({ providedIn: 'root' })
export class AuthHeaderService {

  constructor(private authHeaderStore: AuthHeaderStore) {}

  changeTab(tab: AuthTabsTypeEnum) {
    this.authHeaderStore.setTab(tab);
  }

  setDefault() {
    this.authHeaderStore.setDefault();
  }
}
