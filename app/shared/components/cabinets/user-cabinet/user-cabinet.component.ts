import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';
import { take } from 'rxjs/operators';
import { userData$, UserInterface } from '../../../helpers/auth-user.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { VALIDATION_PASSWORD_REGEXP } from '../../../helpers/input-validators.helper';
import { fieldsAreEqual } from '../../../helpers/validators/fields-are-equal.validator';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../environments/environment';

export enum AutoCompleteTypesEnum {
  currentPass = 'current-password',
}

export enum UserCabinetStateType {
  userData = 'userData',
  passwordRecovery = 'passwordRecovery',
}

@UntilDestroy()
@Component({
  selector: 'user-cabinet',
  templateUrl: './user-cabinet.component.html',
  styleUrls: ['./user-cabinet.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserCabinetComponent implements OnInit {
  activeState: UserCabinetStateType = UserCabinetStateType.userData;
  readonly userCabinetStateType = UserCabinetStateType;
  user: UserInterface | null = null;
  error: string = '';
  API_URL = environment.API_URL;
  changePasswordError: string = '';
  getUserDataSub = Subscription.EMPTY;
  sendChangePasswordSub = Subscription.EMPTY;
  sendChangeNameSub = Subscription.EMPTY;
  changingAvatarSub = Subscription.EMPTY;
  passwordForm: FormGroup = this.formBuilder.group({
      old_password: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
    },
    {
      validators: [fieldsAreEqual('password', 'password_confirmation')],
    },
  );
  nameForm: FormGroup = this.formBuilder.group({
    name: new FormControl(''),
  });
  avatar = new FormControl('');
  isInputNameShown: boolean = false;
  serverError: string = '';

  constructor(
    private userStore: UserStoreService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
  }

  changeState(state: UserCabinetStateType) {
    this.activeState = state;
  }

  getActiveState(state: UserCabinetStateType) {
    return this.activeState === state;
  }

  getUserData() {
    this.getUserDataSub = this.userStore.getUser()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((userData) => {
          this.user = userData;
          userData$.next(userData);
          this.nameForm.controls['name'].setValue(userData.name);
        },
        (res) => this.error = getBackendMessage(res.message),
      );
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.sendChangePasswordSub = this.userStore.changePassword(this.passwordForm.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.error = '';
            this.notifier.notify('success', this.translate.instant(marker('Пароль успішно змінено')));
            this.passwordForm.reset();
            this.passwordForm.markAsUntouched();
            this.activeState = UserCabinetStateType.userData;
          },
          (res) => {
            if (res.message === 'NotTrueOldPassword') {
              this.serverError = res.message;
            } else {
              this.changePasswordError = getBackendMessage(res.message);
            }
          });
    }
  }

  showInputName() {
    this.isInputNameShown = !this.isInputNameShown;
  }

  changeName() {
    if (this.nameForm.controls['name'].value !== '' && this.nameForm.controls['name'].value !== this.user.name) {
      if (this.nameForm.valid) {
        this.sendChangeNameSub = this.userStore.changeName(this.nameForm.value)
          .pipe(take(1), untilDestroyed(this))
          .subscribe((user) => {
              this.changePasswordError = '';
              this.getUserData();
              this.notifier.notify('success', this.translate.instant(marker('Ім\'я успішно змінено на ' + user.name)));
              this.isInputNameShown = !this.isInputNameShown;
              this.nameForm.controls['name'].setValue('');
              userData$.getValue().name = user.name;
            },
            (res) => this.changePasswordError = getBackendMessage(res.message));
      }
    } else {
      this.isInputNameShown = !this.isInputNameShown;
    }
  }

  changeAvatar() {
    this.changingAvatarSub = this.userStore.changeAvatar(this.avatar.value, this.nameForm.controls.name.value)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((user) => {
          this.user.avatar = user.avatar;
          userData$.getValue().avatar = user.avatar;
          this.notifier.notify('success', this.translate.instant(marker('Аватар успішно змінений')));
        },
        (res) => this.notifier.notify(
          'error', this.translate.instant(getBackendMessage(res.message))));
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
}
