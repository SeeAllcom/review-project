import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorage } from '../../storages/interfaces/local-storage.interface';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { NetworkSettingsService } from '../../services/owner/network-settings.service';
import { environment } from '../../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Title } from '@angular/platform-browser';
import { NetworkHistoryComponent } from './network-history/network-history.component';
import { getLocalizationCityKey } from '../../translates/cities-translate.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { NgxQrcodeElementTypes } from 'ngx-qrcode2';
import { getBackendMessage } from '../../helpers/errors.helper';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Component({
  selector: 'owner-establishment',
  templateUrl: './owner-establishment.component.html',
  styleUrls: ['./owner-establishment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerEstablishmentComponent implements OnInit {
  API_URL = environment.API_URL;
  isTabsToggled: boolean = !!this.cookie.get('network-sidebar');
  isMenuVisible: boolean = false;
  logoutSub = Subscription.EMPTY;
  getNetworkInfoSub = Subscription.EMPTY;
  isOwnerLoggedIn$ = this.userLoginQuery.isOwnerLoggedIn$;
  isWorkerLoggedIn$ = this.userLoginQuery.isWorkerLoggedIn$;
  networkData$ = this.networkSettingsService.networkData$;
  coffeeShopData$ = this.networkSettingsService.coffeeShopData$;
  qrcodeType: NgxQrcodeElementTypes = NgxQrcodeElementTypes.URL;
  qrcodeHref: string = '';
  siteUrl: string = environment.SITE_URL;

  constructor(
    private auth: AuthService,
    private title: Title,
    private dialog: MatDialog,
    private router: Router,
    private customLocalStorage: LocalStorage,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private cookie: CookieService,
    private userLoginQuery: UserLoginQuery,
    private networkSettingsService: NetworkSettingsService,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('CoffeePhone | Business');
    this.getNetworkInfo();
  }

  getNetworkInfo() {
    this.getNetworkInfoSub = this.networkSettingsService.getNetworkInfo()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(
      (res) => {
        this.networkData$.next(res.network);
        this.coffeeShopData$.next(res.coffee_shop);
        if (res.network && res.payment_errors.length) {
          let paymentErrors: string = '';
          if (res.payment_errors) {
            res.payment_errors.forEach((error) => {
              paymentErrors += getBackendMessage(error.value);
            });
          }
          const snackDescription = res.payment_errors && paymentErrors ? paymentErrors
            : 'Налаштуйте платіжні дані, щоб отримувати кошти';
          const snackbar = this.snackbar.open(
            this.translate.instant(marker(snackDescription)),
            'Налаштувати',
            {panelClass: 'error'});
          snackbar.onAction().pipe(take(1), untilDestroyed(this))
            .subscribe(() => this.router.navigate(['/network/settings']));
        }
      });
  }

  getTranslatedCityName(name: string) {
    return getLocalizationCityKey(name);
  }

  toggleTabs() {
    if (this.isTabsToggled) {
      this.isTabsToggled = false;
      this.cookie.remove('network-sidebar');
    } else {
      this.isTabsToggled = true;
      this.cookie.put('network-sidebar', 'smaller');
    }
  }

  toggleMenuVisible() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  hideMenu() {
    this.isMenuVisible = false;
  }

  openQrCodeScanner() {
    this.dialog.open(QrCodeScannerComponent);
  }

  logout() {
    this.logoutSub = this.auth.logout().pipe(take(1), untilDestroyed(this))
      .subscribe(
        () => this.router.navigate(['/network/login']).then(),
        (err) => {
          if (err.message.includes('Unauthenticated')) {
            this.auth.clearAuthStorages();
          }
        });
  }

  openNetworkHistory() {
    this.dialog.open(NetworkHistoryComponent);
  }

  goToSettings() {
    this.router.navigate(['/network/settings']).then();
  }

  saveQrCode(qrcode: any) {
    this.qrcodeHref = qrcode.qrcElement.nativeElement.querySelector('.qrcode img').src;
  }
}
