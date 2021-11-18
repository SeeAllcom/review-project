import { Component, Input, OnInit } from '@angular/core';
import { UserOrdersHistoryProductData, UserUsedAbonementsHistoryData } from '../user-history.helper';
import { environment } from '../../../../../../environments/environment';
import { getLocalizationCityKey } from '../../../../translates/cities-translate.helper';
import { RequestBodyAbonementInterface } from '../../../../helpers/abonements.helper';
import { HistoryRowInfoComponent } from '../../history-row-info/history-row-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'writeoff-abonements',
  templateUrl: './writeoff-abonements.component.html',
})
export class WriteoffAbonementsComponent implements OnInit {
  @Input() writeoff: UserUsedAbonementsHistoryData[] = [];
  rowInfoVisible: boolean = false;
  API_URL = environment.API_URL;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  getTranslatedCity(name: string) {
    return getLocalizationCityKey(name);
  }

  openRowInfo(data: UserOrdersHistoryProductData[]): void {
    this.dialog.open(HistoryRowInfoComponent, {data});
  }
}
