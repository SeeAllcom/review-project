import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { ProductInterface } from '../../../../helpers/products.helper';
import { FormBuilder } from '@angular/forms';
import { NetworkProductsService } from '../../../../services/owner/network-products.service';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { NetworkAbonementResponse } from '../../helpers/network-abonements.helper';
import { NotificationType } from '../../../../objects/notification/notification.component';

export interface ConfirmDeleteInterface {
  notification: string;
  element: ProductInterface | NetworkAbonementResponse | any;
  deleteFunc: () => Observable<any>;
}

@UntilDestroy()
@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
})
export class ConfirmDeleteDialogComponent implements OnInit {
  readonly NotificationType = NotificationType;
  deletingSub = Subscription.EMPTY;
  getProductsSub = Subscription.EMPTY;
  existAbonementsError: string = '';
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private networkProducts: NetworkProductsService,
    private notifier: NotifierService,
    private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteInterface,
  ) {
  }

  ngOnInit(): void {
  }

  deleteElement() {
    this.deletingSub = this.data.deleteFunc()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => this.dialogRef.close(true),
        (res) => {
          if (res.message === 'ExistAbonements') {
            this.existAbonementsError = getBackendMessage(res.message);
          } else {
            this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          }
        });
  }

  confirmDelete(): void {
    this.deletingSub = this.networkProducts.deleteProduct(this.data.element, true)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
          this.dialogRef.close(true);
          this.showSuccessMessage();
        },
        (res) => {
          this.error = getBackendMessage(res.message);
        },
      );
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  showSuccessMessage() {
    // tslint:disable-next-line:max-line-length
    this.notifier.notify('success', `${this.translate.instant(marker('Товар '))}${this.data.element.name}${this.translate.instant(marker(' успішно видалений.'))}`);
  }
}
