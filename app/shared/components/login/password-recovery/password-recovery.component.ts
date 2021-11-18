import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthTabsTypeEnum } from '../state/auth-header.model';
import { AuthHeaderService } from '../state/auth-header.service';
import { AuthService } from '../../../services/auth.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { matchOtherValidator } from '../../../helpers/forms.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Subscription } from 'rxjs';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthComponent } from '../auth.component';
import { fieldsAreEqual } from '../../../helpers/validators/fields-are-equal.validator';
import { VALIDATION_PASSWORD_REGEXP } from '../../../helpers/input-validators.helper';

@UntilDestroy()
@Component({
  selector: 'password-recovery',
  templateUrl: './password-recovery.component.html',
  styles: [':host {margin: auto 0}'],
})
export class PasswordRecoveryComponent implements OnInit {
  minLengthForPassword: number = 8;
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  codeForm: FormGroup = this.formBuilder.group({
      code: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
    },
    {
      validators: [fieldsAreEqual('password', 'password_confirmation')],
    },
  );
  readonly authTabsType = AuthTabsTypeEnum;
  isCodeTemplate: boolean = false;
  sendEmailSub = Subscription.EMPTY;
  sendPasswordRecoverySub = Subscription.EMPTY;
  error: string = '';

  constructor(
    private authHeaderService: AuthHeaderService,
    private auth: AuthService,
    private notifier: NotifierService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AuthComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  changeTab(tab: AuthTabsTypeEnum) {
    this.authHeaderService.changeTab(tab);
  }

  sendEmailPasswordRecovery() {
    this.error = '';
    if (this.form.valid) {
      this.sendEmailSub = this.auth.sendEmailPasswordRecovery(this.form.value.email)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.isCodeTemplate = true;
            this.notifier.notify('success',
              this.translate.instant(marker('Ми надіслали код підтвердження на цей email: ' + this.form.value.email)));
          },
          (res) => this.error = getBackendMessage(res.message),
        );
    }
  }

  sendPasswordRecovery() {
    this.error = '';
    if (this.codeForm.valid) {
      this.sendPasswordRecoverySub = this.auth.sendPasswordRecovery(this.codeForm.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res: any) => {
            if (res.message === 'PasswordUpdate') {
              this.dialogRef.close();
              this.notifier.notify('success',
                this.translate.instant(marker('Пароль успішно відновлений.')));
            } else {
              this.error = getBackendMessage(res.message);
            }
          },
          (res) => {
            if (res.message === 'PageNotFound') {
              this.error = marker('Ви ввели невірний код, або щось пішло не так.');
            } else {
              this.error = getBackendMessage(res.message);
            }
          },
        );
    }
  }
}
