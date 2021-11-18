import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthHeaderStore } from './auth-header.store';
import { AuthTypes } from './auth-header.model';
import { AuthHeaderState } from '../../../helpers/auth-user.helper';

@Injectable({
  providedIn: 'root',
})
export class AuthHeaderQuery extends Query<AuthHeaderState> {
  authType$ = this.select((state: AuthTypes | any) => state.activeAuthTab);

  constructor(protected store: AuthHeaderStore) {
    super(store);
  }

}
