import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectedProductsService } from 'src/app/shared/services/selected-products.service';
import { ONLINE_PAYMENT_COMMISSION } from '../../../helpers/helpers';
import { ProductsTemplate } from '../../../helpers/products.helper';
import { ConfirmDialogComponent } from '../../../objects/confirm-dialog/confirm-dialog.component';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { filter, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthComponent } from '../../login/auth.component';
import { AuthTabsTypeEnum } from '../../login/state/auth-header.model';
import { AuthHeaderService } from '../../login/state/auth-header.service';

@UntilDestroy()
@Component({
  selector: 'choose-payment',
  templateUrl: './choose-payment.component.html',
  styleUrls: ['./choose-payment.component.scss'],
})
export class ChoosePaymentComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() onlinePayment = new EventEmitter<void>();
  @Output() cashPayment = new EventEmitter<void>();
  @Output() bonusesPayment = new EventEmitter<void>();
  @Input() isVisible: boolean;
  @Input() isLoggedIn: boolean;
  @Input() bonuses: number = 0;
  @Input() activeProductsTemplate: ProductsTemplate;
  commission = ONLINE_PAYMENT_COMMISSION;

  constructor(
    private selectedProductsService: SelectedProductsService,
    private dialog: MatDialog,
    private authHeaderService: AuthHeaderService,
  ) { }

  ngOnInit(): void {
  }

  getActualPrice() {
    return this.selectedProductsService.getOrderActualPrice();
  }

  startOnlinePayment() {
    if (!this.isLoggedIn) {
      this.authHeaderService.changeTab(AuthTabsTypeEnum.Login);
      this.dialog.open(AuthComponent).afterClosed()
        .pipe(filter((state) => !!state), take(1), untilDestroyed(this))
        .subscribe(() => this.checkProductsTemplate());
    } else {
      this.checkProductsTemplate();
      this.closePayments();
    }
  }

  checkProductsTemplate() {
    if (this.activeProductsTemplate === ProductsTemplate.ProductsTemplate) {
      const confTitle = marker('Ви знаходитесь в закладі?');
      const confDescr = marker('Товари з розділу меню можна придбати тільки в закладі або по дорозі до нього.' +
        ' Підвердіть, що ви знаходитеся в/біля закладу.');
      const confHint = marker('Якщо ви випадково закрили QR-код замовлення, дістаньте його з історії.');
      this.dialog.open(ConfirmDialogComponent, {data: {
          title: confTitle,
          description: confDescr,
          hint: confHint,
        }}).afterClosed().pipe(filter((isConfirmed) => isConfirmed), take(1), untilDestroyed(this))
        .subscribe(() => this.onlinePayment.emit());
    } else {
      this.onlinePayment.emit();
    }
  }

  closePayments(): void {
    this.close.emit();
  }
}
