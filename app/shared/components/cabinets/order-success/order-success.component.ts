import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  AbonementInterface,
  AbonementQrCodeInterface,
  RequestBodyAbonementInterface,
} from '../../../helpers/abonements.helper';
import { take } from 'rxjs/operators';
import { QrcodeAbonementsDialogComponent } from '../my-abonements/qrcode-abonements-dialog/qrcode-abonements-dialog.component';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { FriendsService } from '../friends/friends.service';
import { FriendsPageResponseData } from '../friends/friends.helper';
import { AbonementsService } from '../../../services/abonements.service';
import { SuccessOrderResponse } from '../../../helpers/products.helper';

@UntilDestroy()
@Component({
  selector: 'order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent implements OnInit {
  paymentOrderId = this.activatedRoute.snapshot.queryParams['paymentOrderId'];
  abonements: AbonementInterface[] = [];
  backendResponse: SuccessOrderResponse;
  isSendGiftTemplate: boolean = false;
  sendGiftError: string = '';
  errorGenerate: string = '';
  serverError: string = '';
  openingQrCodeDialog = Subscription.EMPTY;
  sendingGiftSub = Subscription.EMPTY;
  friendsEmail = new FormControl('', [Validators.required]);
  SITE_URL = environment.SITE_URL;
  sendGiftErrors: string[] = [
    'UserDoesNotExists',
    'YouCannotGiveYourself',
    'AbonementDoesNotExist',
    'QuantityLimitExceeded',
    'InsufficientQuantityAbonements',
  ];
  friendsData: FriendsPageResponseData[] = [];

  constructor(
    private dialog: MatDialog,
    private notifier: NotifierService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private friendsService: FriendsService,
    private abonementsService: AbonementsService,
  ) {
  }

  ngOnInit(): void {
    if (this.paymentOrderId) {
      this.abonementsService.getAbonementsForSuccessOrderPage(this.paymentOrderId)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
            if (!res.order || !res.order.data?.length) {
              this.router.navigate(['/not-found']).then();
            } else {
              this.abonements = res.abonements;
              this.backendResponse = res;
            }
          },
          (res) => {
            this.serverError = getBackendMessage(res.message);
          });

    } else {
      this.router.navigate(['/not-found']).then();
    }
    this.getMyFriends();
  }

  getMyFriends() {
    this.friendsService.getFriends()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => this.friendsData = res.friends);
  }

  showSendGiftTemplate() {
    this.isSendGiftTemplate = true;
  }

  generateQrCode(): void {
    this.isSendGiftTemplate = false;
    this.errorGenerate = '';
    this.openingQrCodeDialog = this.abonementsService.generateAbonementsQrCode(this.initRequestBodyAbonements())
      .pipe(take(1))
      .subscribe((res: AbonementQrCodeInterface | any) => {
          if (this.sendGiftErrors.some((code) => code === res.message)) {
            this.notifier.notify('error', this.translate.instant(res.message));
          } else {
            this.dialog.open(QrcodeAbonementsDialogComponent, {data: res});
          }
          this.router.navigate(['/']).then();
        },
        (res) => {
          this.errorGenerate = getBackendMessage(res.message);
        },
      );
  }

  sengGiftToFriend() {
    this.sendGiftError = '';
    this.errorGenerate = '';
    if (this.friendsEmail.valid) {
      this.sendingGiftSub = this.abonementsService.sengGiftToFriend(
        this.initRequestBodyAbonements(),
        this.friendsEmail.value,
        this.backendResponse.order.id,
      ).pipe(take(1), untilDestroyed(this))
        .subscribe((res: any) => {
            if (this.sendGiftErrors.some((code) => code === res.message)) {
              this.sendGiftError = getBackendMessage(res.message);
            } else {
              this.sendGiftError = '';
              this.errorGenerate = '';
              this.router.navigate(['/']).then();
            }
          },
          (res) => {
            this.errorGenerate = getBackendMessage(res.message);
          },
        );
    }
  }

  initRequestBodyAbonements() {
    let abonementsRequestBody = [];
    this.abonements.forEach((abonement) => {
      abonementsRequestBody = [...abonement.supplements.map((supplement) => {
        return {
          quantity: supplement.quantity,
          supplement,
        } as RequestBodyAbonementInterface;
      }), ...abonementsRequestBody];
    });
    return abonementsRequestBody as RequestBodyAbonementInterface[];
  }

  shopLinkForShare() {
    // tslint:disable-next-line:max-line-length
    return `${this.translate.instant(marker('Привіт, приєднуйся до CoffeePhone. Замовляй абонементи зі знижкою зручно та швидко, переглядай де найближчий заклад, даруй та отримуй подарунки від друзів.'))} | ${this.SITE_URL}`;
  }

  copyEstablishmentLink() {
    this.notifier.notify('primary',
      this.translate.instant(marker('Посилання на CoffeePhone успішно скопійовано. Можете поділитися ним з друзями.')));
  }
}
