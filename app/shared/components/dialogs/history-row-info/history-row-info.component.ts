import { Component, Inject, OnInit } from '@angular/core';
import { UserOrdersHistoryProductData } from '../user-history/user-history.helper';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'history-row-info',
  templateUrl: './history-row-info.component.html',
  styleUrls: ['./history-row-info.component.scss'],
})
export class HistoryRowInfoComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserOrdersHistoryProductData[],
  ) { }

  ngOnInit(): void {
  }

}
