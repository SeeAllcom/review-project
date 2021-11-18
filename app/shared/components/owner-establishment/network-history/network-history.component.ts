import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NetworkHistoryService } from '../../../services/owner/network-history.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  NetworkHistoryOrderData, NetworkHistoryPresent, NetworkHistoryPresentData,
  NetworkHistoryUsedAbonementData,
} from '../helpers/network-history.helper';
import { Subscription } from 'rxjs';

export enum HistoryPageEnum {
  Purchase = 'orders',
  WriteOff = 'used',
  Present = 'present',
}

@UntilDestroy()
@Component({
  selector: 'network-history',
  templateUrl: './network-history.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NetworkHistoryComponent implements OnInit {
  activeTab: HistoryPageEnum = HistoryPageEnum.Purchase;
  readonly historyTabs = HistoryPageEnum;
  historyPurchases: NetworkHistoryOrderData[] = [];
  historyUsedAbonements: NetworkHistoryUsedAbonementData[] = [];
  historyPresents: NetworkHistoryPresentData[] = [];
  getHistorySub = Subscription.EMPTY;
  collectionSize: number = 0;
  itemsPerPage: number = 18;
  page: number = 1;

  constructor(
    private networkHistoryService: NetworkHistoryService,
  ) { }

  ngOnInit(): void {
    this.getNetworkHistory(this.activeTab);
  }

  changeTab(tab: HistoryPageEnum) {
    this.page = 1;
    this.activeTab = tab;
    this.getNetworkHistory(tab);
  }

  getNetworkHistory(tab: HistoryPageEnum) {
    this.getHistorySub = this.networkHistoryService.getNetworkHistory(tab, this.page, this.itemsPerPage)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
        if (this.getActiveTab(HistoryPageEnum.Purchase)) {
          this.historyPurchases = res.orders.data;
          this.collectionSize = res.orders.total;
        } else if (this.getActiveTab(HistoryPageEnum.WriteOff)) {
          this.historyUsedAbonements = res.usedAbonements.data;
          this.collectionSize = res.usedAbonements.total;
        } else if (this.getActiveTab(HistoryPageEnum.Present)) {
          this.historyPresents = res.presentAbonements.data;
          this.collectionSize = res.presentAbonements.total;
        }
      });
  }

  getActiveTab(tab: HistoryPageEnum) {
    return this.activeTab === tab;
  }

  onPageChange(event: any) {
    this.page = event;
    this.getNetworkHistory(this.activeTab);
  }
}
