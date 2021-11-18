import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FriendsPageResponseData, FriendsInterface, SearchUsers, FriendsPageUserInterface } from './friends.helper';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { UserInterface } from '../../../helpers/auth-user.helper';

@Injectable({providedIn: 'root'})
export class FriendsService {

  constructor(
    private http: HttpClient,
    private notifier: NotifierService,
    private translate: TranslateService,
  ) { }

  getFriends(friendId?: number): Observable<FriendsInterface> {
    return this.http.get<FriendsInterface>(`/api/user-site/friends${friendId ? '/' + friendId : ''}`);
  }

  addFriend(friend: FriendsPageResponseData | FriendsPageUserInterface): Observable<FriendsPageResponseData> {
    return this.http.post<FriendsPageResponseData>('/api/user-site/friends/' + friend.id, '')
      .pipe(
        tap(() =>
        this.notifier.notify('success',
          friend.name + this.translate.instant(marker(' доданий(а) до списку ваших друзів')))),
        catchError((res) => {
          this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          return throwError(res);
        }));
  }

  deleteFriend(friend: FriendsPageResponseData | UserInterface): Observable<FriendsInterface> {
    return this.http.delete<FriendsInterface>('/api/user-site/friends/' + friend.id)
      .pipe(
        tap(() =>
          this.notifier.notify('warning',
            friend.name + this.translate.instant(marker(' видалений(а) зі списку ваших друзів')))),
        catchError((res) => {
          this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          return throwError(res);
        }));
  }

  searchFriend(value: string): Observable<SearchUsers> {
    return this.http.get<SearchUsers>('/api/user-site/friends/search/' + value);
  }
}
