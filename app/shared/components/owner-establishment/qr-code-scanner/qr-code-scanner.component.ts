import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { AbonementsService } from '../../../services/abonements.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { abonementWriteOff$ } from '../../../helpers/abonements.helper';
import { Subscription } from 'rxjs';
import { UserInterface } from '../../../helpers/auth-user.helper';
import { environment } from '../../../../../environments/environment';
import { UserOrdersHistoryProductData } from '../../dialogs/user-history/user-history.helper';

@UntilDestroy()
@Component({
  selector: 'qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss'],
})
export class QrCodeScannerComponent implements OnInit {
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  error: string = '';
  result: boolean = false;
  abonementToken: string = '';
  abonementHasAlreadyBeenUsed: string = '';
  isScanSuccess: boolean = false;
  isScanLoaded: boolean = false;
  usedAbonements: UserOrdersHistoryProductData[] = [];
  user: UserInterface = null;
  writeOffAbonementsSub = Subscription.EMPTY;
  deletingOrCodeAbonementsSub = Subscription.EMPTY;
  getInformation = Subscription.EMPTY;
  isDialogNotificationHide: boolean = false;
  API_URL = environment.API_URL;

  constructor(
    private notifier: NotifierService,
    private translate: TranslateService,
    private abonementsService: AbonementsService,
    private dialogRef: MatDialogRef<QrCodeScannerComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  scanAgain() {
    this.isScanLoaded = false;
    this.result = false;
    this.error = '';
  }

  camerasNotFoundHandler(event: any) {
    if (event.toString().includes('Requested device not found')) {
      this.error = this.translate.instant(marker('Дозвольте доступ до камери на вашому пристрої.'));
    } else {
      this.error = getBackendMessage(event.toString());
    }
  }

  scanSuccessHandler(event: string) {
    if (event.includes(this.API_URL + '/api/network/abonements/used/')) {
      this.result = !!event;
      this.onAudioPlay();
    } else {
      this.error = marker('QR-код не валідний, відскануйте інший');
    }
  }

  onAudioPlay() {
    this.audioPlayerRef.nativeElement.play();
  }

  scanErrorHandler(event: any) {
    this.error = getBackendMessage(event);
  }

  scanFailureHandler() {
    this.isScanLoaded = true;
  }

  scanCompleteHandler(event: any) {
    if (event && event.text && event.text.includes('https://dev-api-coffeephone.pp.ua/api/network/abonements/used/')) {
      this.isScanLoaded = true;
      this.isScanSuccess = !!event;
      this.getInformation = this.abonementsService.scanQrCodeAbonements(event.text)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
            if (res.message === 'AbonementHasAlreadyBeenUsed') {
              this.abonementHasAlreadyBeenUsed = getBackendMessage(res.message);
            } else {
              this.usedAbonements = res.usedAbonement.data;
              this.abonementToken = res.usedAbonement.token;
              this.user = res.usedAbonement.user;
            }
          },
          (res) => {
            if (res.message === 'PageNotFound' || res.message === 'AccessIsDenied') {
              this.abonementHasAlreadyBeenUsed = marker('Такого QR-коду не існує.');
            }
          },
        );
    }
  }

  writeOffAbonements() {
    this.writeOffAbonementsSub = this.abonementsService.writeOffAbonements(this.abonementToken)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.usedAbonement.used) {
          this.notifier.notify('success',
            this.translate.instant(marker(
              'Абонемент(и) успішно списані. Щоб побачити їх, відкрийте історію та перейдіть в розділ "Списання".',
            )));
          abonementWriteOff$.next(true);
          this.dialogRef.close();
        } else {
          this.error = marker('Щось пішло не так, спробуйте пізніше або перезавантажте сторінку.');
        }
      }, (res) => {
        if (res.message === 'PageNotFound') {
          this.notifier.notify('error',
            this.translate.instant(marker('QR-код недійсний, скануйте замовлення ще раз.')));
          this.result = false;
        } else {
          this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
        }
      });
  }

  closeDialog() {
    this.deletingOrCodeAbonementsSub = this.abonementsService.deleteQrCodeForOrderAbonements(this.abonementToken)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
        this.notifier.notify('warning',
          this.translate.instant(marker('QR-код цього замовлення більше недійсний.')));
        this.dialogRef.close();
      });
  }

  playAudio() {
    const audio = new Audio();
    audio.src = '/assets/audio/scan.mp3';
    audio.load();
    audio.play().then();
  }
}
