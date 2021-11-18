import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbonementQrCodeInterface, UsedAbonementsInterface } from '../../../../helpers/abonements.helper';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer } from '@angular/platform-browser';
import { AbonementsService } from '../../../../services/abonements.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { SelectedAbonementsService } from '../../../../services/selected-abonements.service';
import { exchangeCodeMessageError } from '../../../../helpers/errors.helper';

@UntilDestroy()
@Component({
  selector: 'qrcode-abonements-dialog',
  templateUrl: './qrcode-abonements-dialog.component.html',
  styleUrls: ['./qrcode-abonements-dialog.component.scss'],
})
export class QrcodeAbonementsDialogComponent implements OnInit, OnDestroy {
  deletingUnusedQrcode = Subscription.EMPTY;
  isMyOrder: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public abonementQrCodeData: AbonementQrCodeInterface,
    private dialogRef: MatDialogRef<QrcodeAbonementsDialogComponent>,
    private notifier: NotifierService,
    private domSanitizer: DomSanitizer,
    private translate: TranslateService,
    private abonementsService: AbonementsService,
    private selectedAbonementsService: SelectedAbonementsService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.abonementQrCodeData.qrCode = '';
  }

  closeDialog() {
    this.deletingUnusedQrcode =
      this.abonementsService.deleteQrCodeForOrderAbonementsInUser(this.abonementQrCodeData.usedAbonement.token)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res: any) => {
            if (res && res.message === 'ShopOpenedAbonement') {
              this.dialogRef.close(true);
              this.selectedAbonementsService.clearSelectedAbonements();
              this.notifier.notify('success',
                this.translate.instant(marker('Кав\'ярня отримала ваше замовлення, очікуйте на нього.')));
            } else {
              this.dialogRef.close(false);
            }
          },
          (res) => {
            if (res.message === 'Unauthenticated.') {
              this.dialogRef.close(false);
              this.selectedAbonementsService.clearSelectedAbonements();
              this.notifier.notify('warning',
                this.translate.instant(marker(exchangeCodeMessageError.Unauthenticated)));
            }
          });
  }

  toggleMyOrderTemplate() {
    this.isMyOrder = !this.isMyOrder;
  }
}
