import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserHistory } from './user-history.helper';
import { take } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';
import { RealtimeUpdatesService } from '../../../websockets/realtime-updates.service';
import { RequestMethodsEnum } from '../../../helpers/urls.helper';

export enum UserHistoryPageEnum {
  Purchase = 'orders',
  WriteOff = 'used-abonements',
  Presents = 'presents',
}

@Injectable({providedIn: 'root'})
export class UserHistoryService {

  constructor(
    private http: HttpClient,
    private realtimeUpdatesService: RealtimeUpdatesService,
  ) { }

  getUserOrdersHistory(
    historyTab: UserHistoryPageEnum,
    page: number,
    itemsPerPage: number,
    network?: string,
    ): Observable<UserHistory> {
    return this.http.get<UserHistory>(
      `/api/user-site/history/${historyTab}/networks${network ? ('/'
        + network) : ''}?page=${page}&limit=${itemsPerPage}&showNetworks=true`);
  }

  isFeedSeen(): Observable<any> {
    return this.http.get<any>('/api/user-site/history/seen', {});
  }

  markHistoryAsSeen(): void {
    this.http.put<void>('/api/user-site/history/seen', {})
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
      this.realtimeUpdatesService.historyUpdated$.next(false);
    });
  }
}
