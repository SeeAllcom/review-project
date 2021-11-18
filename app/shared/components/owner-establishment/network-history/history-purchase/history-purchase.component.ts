import { Component, Input, OnInit } from '@angular/core';
import { NetworkHistoryOrderData } from '../../helpers/network-history.helper';
import { UserOrdersHistoryProductData } from '../../../dialogs/user-history/user-history.helper';
import { HistoryRowInfoComponent } from '../../../dialogs/history-row-info/history-row-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'history-purchase',
  templateUrl: './history-purchase.component.html',
})
export class HistoryPurchaseComponent implements OnInit {
  @Input() purchases: NetworkHistoryOrderData[] = [];
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openRowInfo(data: UserOrdersHistoryProductData[]): void {
    this.dialog.open(HistoryRowInfoComponent, {data});
  }
}
