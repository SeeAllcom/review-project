import { ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DeviceService } from './shared/helpers/device.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './shared/services/auth.service';
import { CitiesService } from './shared/services/cities.service';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { userData$, UserRolesEnum, UserRoleStorageKey } from './shared/helpers/auth-user.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ServiceWorkerManifestManagerService } from './shared/services/service-worker-manifest-manager.service';
import { isPlatformBrowser } from '@angular/common';
import { BrowserCheckerService } from './shared/directives/browser-checker.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WINDOW } from './shared/helpers/window-ref';
import { getUserAgent } from 'universal-user-agent';
import { DynamicContentManagementService } from './shared/services/dynamic-content-management.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './shared/services/language.service';
import { RootUrlService } from './shared/services/root-url.service';
import { PageExcludedService } from './shared/services/page-excluded.service';
import { AppVersionUpdateService } from '../universal/app-version-update.service';
import { sidebarShown$ } from './shared/navigation/mobile-sidebar/mobile-sidebar.helper';
import { UserStoreService } from './shared/services/user-store.service';
import { UserLoginQuery } from './states/user-login/user-login.query';
import { CookieService } from 'ngx-cookie';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  scrollTop = 0;
  rerender = false;
  reloadAnimation: boolean = false;
  currentLang = this.languageService.currLang;
  cityNameEn: any = this.cookie.get('city');
  isSmallDevices = this.deviceDetectorService.isTablet() || this.deviceDetectorService.isMobile();
  isExcludedElementShow: boolean = false;
  isEstablishmentPage: boolean = false;
  isExcludedHeader: boolean = false;
  scrollPrev = 0;
  oneHundred = 100;
  initSupportChatSetTimeout: any;
  sidebarShown$ = sidebarShown$;
  isBrowser = isPlatformBrowser(this.platform);

  // tslint:disable-next-line:cyclomatic-complexity
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isBrowser) {
      const isIos = getUserAgent().match(/(iPhone|iPod|iPad)/i);
      if (isIos && this.isSmallDevices) {
        const scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
        const timeForReloadTimeout = 250;
        const offsetForReload = -120;
        this.scrollTop = scrollTop;
        if ((scrollTop < offsetForReload)) {
          this.reloadAnimation = true;
          setTimeout(() => this.reloadPage(), timeForReloadTimeout);
        }
      }
    }
  }

  constructor(
    private serviceWorkerManifestManagerService: ServiceWorkerManifestManagerService,
    private dynamicContentManagementService: DynamicContentManagementService,
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private citiesService: CitiesService,
    private cookie: CookieService,
    private browserCheckerService: BrowserCheckerService,
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private userQuery: UserLoginQuery,
    private cdr: ChangeDetectorRef,
    private rootUrlService: RootUrlService,
    private pageExcludedService: PageExcludedService,
    private appVersionUpdateService: AppVersionUpdateService,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platform: any,
  ) {}

  ngOnInit() {
    const href = window.location.href;
    if (this.isBrowser && environment.production === true
      && !href.includes('/network/') && !href.includes('/terms-of-use') && !href.includes('/privacy-policy')) {
      this.router.navigate(['/network/for-partners']).then();
    }
    this.languageService.setInitState();
    // this.appVersionUpdateService.notifyOnAppDeploy(this);
    this.serviceWorkerManifestManagerService.changeManifestOnNavigation();
    this.dynamicContentManagementService.processNavigationEvent();
    this.deviceService.initScreenHeight();
    this.getExcludedElementForUserSide();
    this.userConfiguring();
  }

  ngOnDestroy() {
    clearTimeout(this.initSupportChatSetTimeout);
  }

  // private webNotificationClick() {
  //   this.swPush.notificationClicks
  //     .pipe(untilDestroyed(this))
  //     .subscribe((event) => {
  //       console.log('Received notification: ', event);
  //       const url = event.notification.data.url;
  //       if (isPlatformBrowser(this.platform)) {
  //         window.open(url, '_blank');
  //       }
  //     });
  // }

  getExcludedElementForUserSide() {
    this.rootUrlService.url$.pipe(
      tap(() => this.cdr.markForCheck()),
      untilDestroyed(this),
    ).subscribe((page) => {
      this.isExcludedElementShow = !this.pageExcludedService.isPageExcluded(page);
      this.isExcludedHeader = this.pageExcludedService.isPageExcludedForHeader(page);
      this.isEstablishmentPage = page.includes('/establishment/');
    });
  }

  userConfiguring() {
    if (this.isBrowser) {
      const establishmentsUrl = window.location.href;
      const userRole = this.cookie.get(UserRoleStorageKey);
      if (userRole !== UserRolesEnum.Owner && userRole !== UserRolesEnum.Worker) {
        if (this.cityNameEn && !establishmentsUrl.includes('/purchase-establishments')) {
          this.citiesService.getRegion(this.cityNameEn)
            .pipe(filter((city) => !city.error), take(1), untilDestroyed(this))
            .subscribe((city) => {
              this.citiesService.currentCity$.next(city.data);
            });
        }
        this.userQuery.isUserLoggedIn$.pipe(
          filter((isUserLoggedIn) => !!isUserLoggedIn),
          take(1),
          switchMap(() => this.userStore.getUser()),
          untilDestroyed(this),
        ).subscribe((userData) => userData$.next(userData));
      }
    }
  }

  reloadPage() {
    if (this.isBrowser) {
      document.location.reload();
    }
  }

  isPwaApp(): boolean {
    if (this.isBrowser) {
      return (window.matchMedia('(display-mode: standalone)').matches)
        || ('standalone' in window.navigator)
        && (window.navigator['standalone'])
        || document.referrer.includes('android-app://');
    } else {
      return false;
    }
  }
}
