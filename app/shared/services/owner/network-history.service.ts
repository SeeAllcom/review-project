import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistoryPageEnum } from '../../components/owner-establishment/network-history/network-history.component';
import { Observable } from 'rxjs';
import { AllHistoryTabsInterface } from '../../components/owner-establishment/helpers/network-history.helper';

@Injectable()
export class NetworkHistoryService {

  constructor(
    private http: HttpClient,
  ) { }

  getNetworkHistory(tab: HistoryPageEnum, page: number, itemsPerPage: number): Observable<AllHistoryTabsInterface> {
    return this.http.get<AllHistoryTabsInterface>(
      `/api/network/abonements/${tab}?page=${page}&limit=${itemsPerPage}`);
  }
}
