import { Component, Input, OnInit } from '@angular/core';
import { NetworkHistoryUsedAbonementData } from '../../helpers/network-history.helper';
import { environment } from '../../../../../../environments/environment';
import { getLocalizationCityKey } from '../../../../translates/cities-translate.helper';
import { RequestBodyAbonementInterface } from '../../../../helpers/abonements.helper';
import { UserOrdersHistoryProductData } from '../../../dialogs/user-history/user-history.helper';
import { HistoryRowInfoComponent } from '../../../dialogs/history-row-info/history-row-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'history-writeoff',
  templateUrl: './history-writeoff.component.html',
})
export class HistoryWriteoffComponent implements OnInit {
  @Input() writeoff: NetworkHistoryUsedAbonementData[] = [];
  API_URL = environment.API_URL;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getTranslatedCityName(name: string) {
    return getLocalizationCityKey(name);
  }

  openRowInfo(data: UserOrdersHistoryProductData[]): void {
    this.dialog.open(HistoryRowInfoComponent, {data});
  }
}
