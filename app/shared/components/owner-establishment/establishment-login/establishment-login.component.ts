import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserRolesEnum } from '../../../helpers/auth-user.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { exchangeCodeMessageError, getBackendMessage, UnauthenticatedError$ } from '../../../helpers/errors.helper';
import { Title } from '@angular/platform-browser';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { AuthTabsTypeEnum } from '../../login/state/auth-header.model';
import { AuthComponent } from '../../login/auth.component';
import { AuthHeaderService } from '../../login/state/auth-header.service';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'establishment-login',
  templateUrl: './establishment-login.component.html',
  styleUrls: ['./establishment-login.component.scss'],
})
export class EstablishmentLoginComponent implements OnInit {
  loginSub = Subscription.EMPTY;
  minLengthForPassword: number = 8;
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(this.minLengthForPassword)]),
  });
  unauthenticatedError = exchangeCodeMessageError[UnauthenticatedError$.getValue()];
  error: string = '';
  isVisibilityPassword: boolean = false;
  isSendingEmailAgain: boolean = false;
  exchangeCodeMessageError = exchangeCodeMessageError;

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private title: Title,
    private authHeaderService: AuthHeaderService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle(
      this.translate.instant(marker('Увійти в CoffeePhone | Business')),
    );
  }

  openPasswordRecovery() {
    this.authHeaderService.changeTab(AuthTabsTypeEnum.PasswordRecovery);
    this.dialog.open(AuthComponent, {data: {hideBackBtn: true}});
  }

  sendForm() {
    this.error = '';
    if (this.form.valid) {
      this.loginSub = this.auth.login(this.form.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
            if (res.role === UserRolesEnum.User) {
              this.router.navigate(['/']).then();
            } else {
              this.router.navigate(['/network']).then();
              UnauthenticatedError$.next('');
            }
          },
          (res) => {
            this.error = getBackendMessage(res.message);
          },
        );
    }
  }

  sendMailAgain() {
    this.isSendingEmailAgain = true;
    if (this.form.value.email) {
      this.auth.sendMailAgain(this.form.value.email)
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
