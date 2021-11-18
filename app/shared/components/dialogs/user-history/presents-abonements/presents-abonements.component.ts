import { Component, Input, OnInit } from '@angular/core';
import { UserOrdersHistoryProductData, UserPresentHistoryData } from '../user-history.helper';
import { environment } from '../../../../../../environments/environment';
import { RequestBodyAbonementInterface } from '../../../../helpers/abonements.helper';
import { HistoryRowInfoComponent } from '../../history-row-info/history-row-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'presents-abonements',
  templateUrl: './presents-abonements.component.html',
})
export class PresentsAbonementsComponent implements OnInit {
  @Input() presents: UserPresentHistoryData[] = [];
  rowInfoVisible: boolean = false;
  rowInfoData: RequestBodyAbonementInterface[] = [];
  API_URL = environment.API_URL;

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  openRowInfo(data: UserOrdersHistoryProductData[]): void {
    this.dialog.open(HistoryRowInfoComponent, {data});
  }
}
