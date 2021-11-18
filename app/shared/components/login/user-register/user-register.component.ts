import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { matchOtherValidator } from '../../../helpers/forms.helper';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthTabsTypeEnum } from '../state/auth-header.model';
import { AuthHeaderService } from '../state/auth-header.service';
import { AuthService } from '../../../services/auth.service';
import { fieldsAreEqual } from '../../../helpers/validators/fields-are-equal.validator';
import { VALIDATION_PASSWORD_REGEXP } from '../../../helpers/input-validators.helper';

@UntilDestroy()
@Component({
  selector: 'user-register',
  templateUrl: './user-register.component.html',
})
export class UserRegisterComponent implements OnInit {
  minLengthForPassword: number = 8;
  isRegisterFormInvalid: boolean = false;
  registerForm: FormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
      privacy_policy: new FormControl(null, [Validators.required]),
    },
    {
      validators: [fieldsAreEqual('password', 'password_confirmation')],
    },
  );
  checked: boolean = false;
  registeredSuccess: string = '';
  error: string = '';
  registerSub = Subscription.EMPTY;
  authTabsType = AuthTabsTypeEnum;

  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private translate: TranslateService,
    private authHeaderService: AuthHeaderService,
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
  }

  changeTab(tab: AuthTabsTypeEnum) {
    this.authHeaderService.changeTab(tab);
  }

  register() {
    this.registeredSuccess = '';
    this.error = '';
    if (this.registerForm.valid && this.checked) {
      this.isRegisterFormInvalid = false;
      this.registerSub = this.auth.register(this.registerForm.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
            if (res.message) {
              this.registeredSuccess = getBackendMessage(res.message);
              this.notifierService.notify('success', this.translate.instant(marker('Ви успішно зареєструвалися.')));
              this.registerForm.reset();
              const fiveSeconds = 5000;
              setTimeout(() => {
                this.changeTab(this.authTabsType.Login);
                this.registeredSuccess = '';
              }, fiveSeconds);
            }
          },
          (res) => {
            this.error = getBackendMessage(res.errors.email);
            throw res;
          },
        );
    } else {
      this.isRegisterFormInvalid = true;
    }
  }
}
