import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserRolesEnum, UserTokenStorageKey } from '../../../helpers/auth-user.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { exchangeCodeMessageError, getBackendMessage } from '../../../helpers/errors.helper';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from '../auth.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthTabsTypeEnum } from '../state/auth-header.model';
import { AuthHeaderService } from '../state/auth-header.service';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
})
export class UserLoginComponent implements OnInit, OnDestroy {
  minLengthForPassword = 8;
  error: string = '';
  loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(this.minLengthForPassword)]),
  });
  isSendingEmailAgain: boolean = false;
  isVisibilityPassword: boolean = false;
  loginSub = Subscription.EMPTY;
  exchangeCodeMessageError = exchangeCodeMessageError;
  authTabsType = AuthTabsTypeEnum;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private dialog: MatDialogRef<AuthComponent>,
    private translate: TranslateService,
    private router: Router,
    private cookie: CookieService,
    private authHeaderService: AuthHeaderService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  changeTab(tab: AuthTabsTypeEnum) {
    this.authHeaderService.changeTab(tab);
    this.error = '';
  }

  login() {
    this.error = '';
    if (this.loginForm.valid) {
      this.loginSub = this.auth.login(this.loginForm.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(
        ({access_token, role}) => {
          if (!!access_token && role === UserRolesEnum.User) {
            this.dialog.close(true);
          } else {
            this.error =
              this.translate.instant(
                marker('Ви не можете авторизуватися тут за цими реквізитами для входу.' +
                  ' Через 5 секунд ми переспрямуємо вас на ваш обліковий запис.'),
              );
            const fiveSeconds = 5000;
            setTimeout(() => {
              if (role === UserRolesEnum.Owner || role === UserRolesEnum.Worker) {
                this.router.navigate(['/network']).then();
              }
              this.dialog.close();
            }, fiveSeconds);
          }
        },
        (res) => {
          this.error = getBackendMessage(res.message);
          if (!!this.cookie.get(UserTokenStorageKey)) {
            this.cookie.remove(UserTokenStorageKey);
          }
          throw res;
        },
      );
    }
  }

  sendMailAgain() {
    this.isSendingEmailAgain = true;
    if (this.loginForm.value.email) {
      this.auth.sendMailAgain(this.loginForm.value.email)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.error = '';
            this.isSendingEmailAgain = false;
          },
          (res) => {
            this.isSendingEmailAgain = false;
            this.error = getBackendMessage(res.message);
          },
        );
    }
  }
}
