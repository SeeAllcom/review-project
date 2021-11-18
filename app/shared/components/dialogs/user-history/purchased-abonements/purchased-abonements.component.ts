import { Component, Input, OnInit } from '@angular/core';
import { UserOrdersHistoryData, UserOrdersHistoryProductData } from '../user-history.helper';
import { environment } from '../../../../../../environments/environment';
import { ProductsService } from '../../../../services/products.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserHistoryComponent } from '../user-history.component';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Subscription } from 'rxjs';
import { HistoryRowInfoComponent } from '../../history-row-info/history-row-info.component';

@UntilDestroy()
@Component({
  selector: 'purchased-abonements',
  templateUrl: './purchased-abonements.component.html',
})
export class PurchasedAbonementsComponent implements OnInit {
  @Input() purchases: UserOrdersHistoryData[] = [];
  rowInfoId: number = null;
  API_URL = environment.API_URL;
  payOrderClick: boolean = false;
  payOrderSub = Subscription.EMPTY;

  constructor(
    private productService: ProductsService,
    private dialogRef: MatDialogRef<UserHistoryComponent>,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
  }

  openRowInfo(data: UserOrdersHistoryProductData[]): void {
    if (!this.payOrderClick) {
      this.dialog.open(HistoryRowInfoComponent, {data});
    }
  }

  isBtnWithSpinner(orders: UserOrdersHistoryData): boolean {
    return this.rowInfoId === orders.id;
  }

  payOrder(order: UserOrdersHistoryData) {
    this.rowInfoId = order.id;
    this.payOrderClick = true;
    this.payOrderSub = this.productService.sendOrderFromHistory(order)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
          this.dialogRef.close();
          this.rowInfoId = null;
          this.payOrderClick = false;
        },
        (res) => {
          if (res.message === 'TheOrderIsSpoiled' || res.message === 'PaymentTermExpired') {
            order.is_spoiled = 1;
          }
          this.rowInfoId = null;
          this.payOrderClick = false;
          this.notifier.notify('error', this.translate.instant(
            marker(getBackendMessage(res.message)),
          ));
        });
  }
}
