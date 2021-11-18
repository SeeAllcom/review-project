import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UserHistoryPageEnum, UserHistoryService } from './user-history.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { UserOrdersHistoryData, UserPresentHistoryData, UserUsedAbonementsHistoryData } from './user-history.helper';
import { NetworkKeysInterface } from '../../../helpers/networks.helper';
import { RealtimeUpdatesService } from '../../../websockets/realtime-updates.service';

@UntilDestroy()
@Component({
  selector: 'user-history',
  templateUrl: './user-history.component.html',
})
export class UserHistoryComponent implements OnInit {
  currentNetwork$ = new BehaviorSubject<string>('');
  activeTab: UserHistoryPageEnum = UserHistoryPageEnum.Purchase;
  readonly historyTabs = UserHistoryPageEnum;
  historyPurchases: UserOrdersHistoryData[] = [];
  historyUsedAbonements: UserUsedAbonementsHistoryData[] = [];
  presents: UserPresentHistoryData[] = [];
  historyNetworks: NetworkKeysInterface[] = [];
  getHistorySub = Subscription.EMPTY;
  collectionSize: number = 0;
  itemsPerPage: number = 13;
  page: number = 1;
  areaFilterCtrl: FormControl = new FormControl('');
  error: string = '';
  searchCoffeeShopValue: string = '';
  historyUpdated$ = this.realtimeUpdatesService.historyUpdated$;

  constructor(
    private userHistoryService: UserHistoryService,
    private realtimeUpdatesService: RealtimeUpdatesService,
  ) {
  }

  ngOnInit(): void {
    this.getUserHistory(this.activeTab);
  }

  changeTab(tab: UserHistoryPageEnum) {
    this.page = 1;
    this.activeTab = tab;
    this.areaFilterCtrl.setValue('');
    this.currentNetwork$.next('');
    this.getUserHistory(tab, '');
  }

  compareObjects(o1: string, o2: string): boolean {
    return o1 === o2;
  }

  getErrorMsg(code: string) {
    return getBackendMessage(code);
  }

  getUserHistorySomeCoffeeShops(networkId: string) {
    this.page = 1;
    this.areaFilterCtrl.setValue(networkId);
    this.currentNetwork$.next(networkId);
    this.getUserHistory(this.activeTab, networkId);
  }

  getUserHistory(tab: UserHistoryPageEnum, networkId?: string) {
    this.getHistorySub = this.userHistoryService.getUserOrdersHistory(tab, this.page, this.itemsPerPage, networkId)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
          if (!networkId) {
            this.historyNetworks = res.networks;
          }
          if (this.getActiveTab(UserHistoryPageEnum.Purchase)) {
            this.historyPurchases = res.orders.data;
            this.collectionSize = res.orders.total;
          } else if (this.getActiveTab(UserHistoryPageEnum.WriteOff)) {
            this.historyUsedAbonements = res.usedAbonements.data;
            this.collectionSize = res.usedAbonements.total;
          } else if (this.getActiveTab(UserHistoryPageEnum.Presents)) {
            this.presents = res.presentAbonements.data;
            this.collectionSize = res.presentAbonements.total;
            if (!!this.realtimeUpdatesService.historyUpdated$.value) {
              this.userHistoryService.markHistoryAsSeen();
            }
          }
        },
        (res) => {
          this.error = getBackendMessage(res.message);
        },
      );
  }

  getActiveTab(tab: UserHistoryPageEnum) {
    return this.activeTab === tab;
  }

  onPageChange(event: number) {
    this.page = event;
    this.getUserHistory(this.activeTab, this.currentNetwork$.getValue());
  }
}
