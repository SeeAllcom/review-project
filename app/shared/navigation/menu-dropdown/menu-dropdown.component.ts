import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RootUrlService } from '../../services/root-url.service';
import { Router } from '@angular/router';
import { LocalStorage } from '../../storages/interfaces/local-storage.interface';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { CitiesService } from '../../services/cities.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { LanguageDialogComponent } from '../../components/language-dialog/language-dialog.component';
import { UserHistoryComponent } from '../../components/dialogs/user-history/user-history.component';
import { HotOrderDialogComponent } from '../../components/dialogs/hot-order-dialog/hot-order-dialog.component';
import { userData$ } from '../../helpers/auth-user.helper';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Component({
  selector: 'menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuDropdownComponent implements OnInit, OnDestroy {
  isCabinetPages$ = this.rootUrlService.checkNeededPage('cabinet');
  isUserLogin$ = this.userLoginQuery.isUserLoggedIn$;
  currentCity$ = this.citiesService.currentCity$;
  userData$ = userData$;
  API_URL = environment.API_URL;

  constructor(
    private auth: AuthService,
    private rootUrlService: RootUrlService,
    private router: Router,
    private dialog: MatDialog,
    private cookie: CookieService,
    private userLoginQuery: UserLoginQuery,
    private citiesService: CitiesService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  logout() {
    this.auth.logout().pipe(take(1), untilDestroyed(this))
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

  openCitiesPage() {
    this.cookie.remove('city');
    this.citiesService.currentCity$.next(null);
    this.router.navigate(['/']).then();
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

  private getUnauthenticatedError(err: any) {
    if (err.message.includes('Unauthenticated')) {
      this.auth.clearAuthStorages();
    }
  }
}
