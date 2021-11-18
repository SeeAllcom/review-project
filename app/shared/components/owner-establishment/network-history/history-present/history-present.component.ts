import { Component, Input, OnInit } from '@angular/core';
import { NetworkHistoryPresentData } from '../../helpers/network-history.helper';
import { UserOrdersHistoryProductData } from '../../../dialogs/user-history/user-history.helper';
import { HistoryRowInfoComponent } from '../../../dialogs/history-row-info/history-row-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'history-present',
  templateUrl: './history-present.component.html',
})
export class HistoryPresentComponent implements OnInit {
  @Input() historyPresents: NetworkHistoryPresentData[];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openRowInfo(data: UserOrdersHistoryProductData[]): void {
    this.dialog.open(HistoryRowInfoComponent, {data});
  }
}
