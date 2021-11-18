import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { LocalStorage } from '../../storages/interfaces/local-storage.interface';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CitiesService } from '../../services/cities.service';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { RootUrlService } from '../../services/root-url.service';
import { CityDialogComponent } from '../../components/city-dialog/city-dialog.component';
import { AuthTabsTypeEnum } from '../../components/login/state/auth-header.model';
import { AuthComponent } from '../../components/login/auth.component';
import { AuthHeaderService } from '../../components/login/state/auth-header.service';
import { isPlatformBrowser } from '@angular/common';
import { getLocalizationCityKey } from '../../translates/cities-translate.helper';
import { UserQrcodeScannerComponent } from '../../components/dialogs/user-qrcode-scanner/user-qrcode-scanner.component';
import { sidebarShown$ } from '../mobile-sidebar/mobile-sidebar.helper';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MobileMenuComponent implements OnInit {
  isCabinetPages$ = this.rootUrlService.checkNeededPage('cabinet');
  isUserLogin$ = this.userLoginQuery.isUserLoggedIn$;
  currentCity$ = this.citiesService.currentCity$;
  readonly authTabsTypeEnum = AuthTabsTypeEnum;
  isMyAbonementsUrls = ['/establishments-abonements', '/season-tickets'];
  isBuyAbonementsUrls = ['/cities', '/establishment/', '/purchase-establishments'];
  activeOnboardingSlide: number = 0;
  onboardingShown: boolean = false;
  @Input() isPwa: boolean;
  @Input() isEstablishmentPage: boolean;

  constructor(
    private customLocalStorage: LocalStorage,
    private cookie: CookieService,
    private auth: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private citiesService: CitiesService,
    private userLoginQuery: UserLoginQuery,
    private rootUrlService: RootUrlService,
    private authHeaderService: AuthHeaderService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit(): void {
    this.onboardingShown = !this.cookie.get('mobile-onboarding');
  }

  getActiveLink(urls: string[]): boolean {
    if (isPlatformBrowser(this.platform)) {
      return urls.some((route) => this.router.url.includes(route));
    } else {
      return false;
    }
  }

  getTranslatedCityName(name: string) {
    return getLocalizationCityKey(name);
  }

  openAuthDialog(tab: AuthTabsTypeEnum) {
    this.authHeaderService.changeTab(tab);
    this.dialog.open(AuthComponent);
  }

  openCitiesSelector() {
    this.dialog.open(CityDialogComponent);
  }

  openQrCodeScanner() {
    this.dialog.open(UserQrcodeScannerComponent);
  }

  isPwaApp(): boolean {
    if (isPlatformBrowser(this.platform)) {
      return (window.matchMedia('(display-mode: standalone)').matches)
        || ('standalone' in window.navigator)
        && (window.navigator['standalone'])
        || document.referrer.includes('android-app://');
    } else {
      return false;
    }
  }

  nextSlide() {
    this.activeOnboardingSlide++;
  }

  prevSlide() {
    this.activeOnboardingSlide--;
  }

  openMobileSidebar() {
    sidebarShown$.next(true);
  }

  closeOnboarding() {
    this.onboardingShown = false;
    this.cookie.put('mobile-onboarding', 'showed');
  }
}
