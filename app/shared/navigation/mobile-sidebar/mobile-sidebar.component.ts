import { Component, OnInit } from '@angular/core';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { RootUrlService } from '../../services/root-url.service';
import { CitiesService } from '../../services/cities.service';
import { LanguageDialogComponent } from '../../components/language-dialog/language-dialog.component';
import { UserHistoryComponent } from '../../components/dialogs/user-history/user-history.component';
import { HotOrderDialogComponent } from '../../components/dialogs/hot-order-dialog/hot-order-dialog.component';
import { LocalStorage } from '../../storages/interfaces/local-storage.interface';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '../../services/auth.service';
import { AuthTabsTypeEnum } from '../../components/login/state/auth-header.model';
import { AuthComponent } from '../../components/login/auth.component';
import { AuthHeaderService } from '../../components/login/state/auth-header.service';
import { sidebarShown$ } from './mobile-sidebar.helper';
import { userData$ } from '../../helpers/auth-user.helper';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Component({
  selector: 'mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  styleUrls: ['./mobile-sidebar.component.scss'],
})
export class MobileSidebarComponent implements OnInit {
  readonly authTabsTypeEnum = AuthTabsTypeEnum;
  isCabinetPages$ = this.rootUrlService.checkNeededPage('cabinet');
  isUserLogin$ = this.userLoginQuery.isUserLoggedIn$;
  currentCity$ = this.citiesService.currentCity$;
  userData$ = userData$;
  API_URL = environment.API_URL;

  constructor(
    private userLoginQuery: UserLoginQuery,
    private authHeaderService: AuthHeaderService,
    private rootUrlService: RootUrlService,
    private citiesService: CitiesService,
    private dialog: MatDialog,
    private router: Router,
    private cookie: CookieService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  openCities() {
    this.cookie.remove('city');
    this.citiesService.currentCity$.next(null);
    this.router.navigate(['/']).then();
  }

  openAuthDialog(tab: AuthTabsTypeEnum) {
    this.authHeaderService.changeTab(tab);
    this.dialog.open(AuthComponent);
  }

  openLanguagesDialog() {
    this.dialog.open(LanguageDialogComponent);
  }

  openUserHistory() {
    this.dialog.open(UserHistoryComponent);
  }

  openHotOrder() {
    this.dialog.open(HotOrderDialogComponent);
  }

  logout() {
    this.auth.logout()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(
        () => {},
        (err) => {
          this.getUnauthenticatedError(err);
        });
  }

  logoutFromCabinetPages() {
    this.router.navigate(['/']).then(() => {
      this.auth.logout().pipe(take(1), untilDestroyed(this))
        .subscribe(
          () => {},
          (err) => {
            this.getUnauthenticatedError(err);
          });
    });
  }

  closeSidebar() {
    sidebarShown$.next(false);
  }

  private getUnauthenticatedError(err: any) {
    if (err.message.includes('Unauthenticated')) {
      this.auth.clearAuthStorages();
    }
  }
}
