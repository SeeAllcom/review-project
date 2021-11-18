import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, take, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserLoginStore } from '../../states/user-login/user-login.store';
import {
  RefreshTokenLogin,
  User, userData$,
  UserInterface, UserLogin, UserPasswordRecovery, UserRefreshTokenStorageKey,
  UserRolesEnum,
  UserRoleStorageKey,
  UserTokenStorageKey,
} from '../helpers/auth-user.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { LanguageService } from './language.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage, UnauthenticatedError$ } from '../helpers/errors.helper';
import { AuthComponent } from '../components/login/auth.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthHeaderStore } from '../components/login/state/auth-header.store';
import { AuthTabsTypeEnum } from '../components/login/state/auth-header.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Injectable({providedIn: 'root'})
export class AuthService {
  readonly userRolesEnum = UserRolesEnum;
  private token: string = !!this.cookie.get(UserTokenStorageKey) ? this.cookie.get(UserTokenStorageKey) : null;
  private role: string = !!this.cookie.get(UserRoleStorageKey) ? this.cookie.get(UserRoleStorageKey) : null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private userLoginStore: UserLoginStore,
    private cookie: CookieService,
    private languageService: LanguageService,
    private notifierService: NotifierService,
    private dialogRef: MatDialog,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private authHeaderStore: AuthHeaderStore,
    private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
  }

  register(user: UserInterface): Observable<User> {
    return this.http.post<User>('/api/register', user).pipe(
      map((response) => response),
      catchError((error) => throwError(error)),
    );
  }

  login(user: User): Observable<UserLogin> {
    return this.http.post<UserLogin>('/api/login', user).pipe(
      tap((userData) => {
        this.setLoginUserData(userData);
      }),
      catchError((error) => throwError(error)),
    );
  }

  refreshingToken(): Observable<RefreshTokenLogin> {
    const body = {refresh_token: this.cookie.get(UserRefreshTokenStorageKey)};
    return this.http.post<RefreshTokenLogin>('/api/token/refresh', body)
      .pipe(tap((tokens) => this.setTokens(tokens)));
  }

  setLoginUserData(userData: UserLogin) {
    this.setTokens(userData);
    this.setRole(userData.role);
    if (this.cookie.get(UserRoleStorageKey)) {
      this.cookie.remove(UserRoleStorageKey);
    }
    this.cookie.put(UserRoleStorageKey, userData.role);
    this.userLoginStore.update({
      isLoggedIn: !!userData.access_token,
      userRole: userData.role,
    });
    userData$.next(userData.user);
  }

  setTokens(refreshTokenLogin: RefreshTokenLogin) {
    this.setToken(refreshTokenLogin.access_token);
    if (this.cookie.get(UserTokenStorageKey) || this.cookie.get(UserRefreshTokenStorageKey)) {
      this.cookie.remove(UserTokenStorageKey);
      this.cookie.remove(UserRefreshTokenStorageKey);
    }
    this.cookie.put(UserTokenStorageKey, refreshTokenLogin.access_token);
    this.cookie.put(UserRefreshTokenStorageKey, refreshTokenLogin.refresh_token);
  }

  sendMailAgain(email: string) {
    const formData: FormData = new FormData();
    formData.append('email', email);
    return this.http.post('/api/resend-message-confirm-mail', formData).pipe(
      tap(() => this.notifierService.notify('success', `
       ${this.translate.instant(marker('Лист на email: '))}
       ${email}
       ${this.translate.instant(marker(' успішно відправлений:лист.'))}
      `)),
      catchError((error) => throwError(error)),
    );
  }

  sendEmailPasswordRecovery(email: string) {
    return this.http.post('/api/reset-password/send-code', {email});
  }

  sendPasswordRecovery(formValue: UserPasswordRecovery) {
    return this.http.put('/api/reset-password/' + formValue.code, formValue);
  }

  setToken(token: string) {
    this.token = token;
  }

  setRole(role: string) {
    this.role = role;
  }

  getRole() {
    return this.role;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.role;
  }

  logout() {
    return this.http.post('/api/logout', this.getToken()).pipe(
      tap(() => {
        this.clearAuthStorages();
        this.notifierService.notify('primary', this.translate.instant(marker('Ви вийшли з облікового запису')));
      }),
      catchError((error) => throwError(error)),
    );
  }

  clearAuthStorages() {
    if (this.getRole() === this.userRolesEnum.Worker || this.getRole() === this.userRolesEnum.Owner) {
      this.router.navigate(['/network/login']).then();
    }
    userData$.next(null);
    this.setToken('');
    this.setRole('');
    this.cookie.remove(UserTokenStorageKey);
    this.cookie.remove(UserRefreshTokenStorageKey);
    this.cookie.remove(UserRoleStorageKey);
    this.userLoginStore.update({
      isLoggedIn: false,
      userRole: '',
    });
  }

  showUnauthenticatedMessage(message: string) {
    UnauthenticatedError$.next(message);
    this.dialogRef.closeAll();
    this.checkIsCabinetsPages();
    if (this.getRole() === UserRolesEnum.User) {
      this.showLoginSnackbar(message);
    } else {
      this.notifierService.notify('warning', this.translate.instant(getBackendMessage(message)));
    }
    this.clearAuthStorages();
  }

  private checkIsCabinetsPages() {
    if (this.router.url.includes('cabinet')) {
      this.router.navigate(['/']).then();
    }
  }

  private showLoginSnackbar(errorMsg: string): void {
    const snackbar = this.snack.open(this.translate.instant(getBackendMessage(errorMsg)),
      this.translate.instant(marker('Увійти')), {panelClass: 'warning', duration: 5000});
    snackbar.onAction().pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
        this.authHeaderStore.setTab(AuthTabsTypeEnum.Login);
        this.dialog.open(AuthComponent);
      });
  }
}
