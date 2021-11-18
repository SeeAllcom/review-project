import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OwnerEditingDialogComponent } from './owner-editing-dialog/owner-editing-dialog.component';
import { NetworkSettingsService } from '../../../services/owner/network-settings.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, first, take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkInterface, NetworkKeysInterface, NetworkPaymentErrors } from '../../../helpers/networks.helper';
import { FLAGS_SPRITE } from '../../../helpers/variables.helper';
import { LanguageConfig, LANGUAGES } from '../../../helpers/translate.helper';
import { LanguageService } from '../../../services/language.service';
import { VALIDATION_PASSWORD_REGEXP } from '../../../helpers/input-validators.helper';
import { fieldsAreEqual } from '../../../helpers/validators/fields-are-equal.validator';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { UserStoreService } from '../../../services/user-store.service';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { UserLoginQuery } from '../../../../states/user-login/user-login.query';
import { CoffeeShopInterface } from '../helpers/network.helper';
import { NotificationType } from '../../../objects/notification/notification.component';
import { WorkerEditingDialogComponent } from './worker-editing-dialog/worker-editing-dialog.component';
import { MIN_BONUSES_PERCENTAGE } from '../../../helpers/helpers';
import { WorkScheduleDialogComponent } from './work-schedule-dialog/work-schedule-dialog.component';

enum SettingsStateType {
  networkData = 'userData',
  passwordRecovery = 'passwordRecovery',
}

@UntilDestroy()
@Component({
  selector: 'owner-admin',
  templateUrl: './owner-settings.component.html',
  styleUrls: ['./owner-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerSettingsComponent implements OnInit {
  @Output() onSaveChanges = new EventEmitter();
  activeState: SettingsStateType = SettingsStateType.networkData;
  readonly settingsStateType = SettingsStateType;
  readonly NotificationType = NotificationType;
  networkError: string = '';
  form: FormGroup = new FormGroup({
    avatar: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    work_schedule: new FormControl( ''),
    instagram: new FormControl(''),
    facebook: new FormControl(''),
    description: new FormControl(''),
  });
  localizationForm: FormGroup = new FormGroup({
    language: new FormControl('', [Validators.required]),
  });
  paymentForm: FormGroup = new FormGroup({
    payment_id: new FormControl('', [Validators.required]),
  });
  minBonusesPercentage = MIN_BONUSES_PERCENTAGE;
  bonusesPercentage = new FormControl('', [Validators.required, Validators.min(this.minBonusesPercentage)]);
  passwordForm: FormGroup = this.formBuilder.group({
      old_password: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
    },
    {
      validators: [fieldsAreEqual('password', 'password_confirmation')],
    },
  );
  getNetworkInfoSub = Subscription.EMPTY;
  sendNetworkInfoSub = Subscription.EMPTY;
  sendChangePasswordSub = Subscription.EMPTY;
  sendPaymentDataSub = Subscription.EMPTY;
  sendBonusesPercentageSub = Subscription.EMPTY;
  networkInfo: NetworkKeysInterface | null = null;
  network: NetworkInterface | null = null;
  coffeeShopInfo: CoffeeShopInterface | null = null;
  API_URL = environment.API_URL;
  flagsSpriteName = FLAGS_SPRITE;
  languageIcon: string = '';
  changePasswordError: string = '';
  notTrueOldPassword: boolean = false;
  paymentErrors: NetworkPaymentErrors[] = [];
  languages = LANGUAGES;
  originalOrder = ((): number => 0);
  isOwnerLoggedIn$ = this.userLoginQuery.isOwnerLoggedIn$;
  workSchedule: FormGroup;

  constructor(
    private dialog: MatDialog,
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private networkSettingsService: NetworkSettingsService,
    private userStore: UserStoreService,
    private translate: TranslateService,
    private notifier: NotifierService,
    private userLoginQuery: UserLoginQuery,
  ) {
  }

  ngOnInit(): void {
    this.getNetworkInfo();
    this.languageService.currentLanguage$
      .pipe(first(), untilDestroyed(this))
      .subscribe((language) => {
        const languageField = this.localizationForm.controls['language'];
        languageField.setValue(language);
        this.setLanguageIcon(this.languages[languageField.value]);
      });
  }

  changeState(state: SettingsStateType) {
    this.activeState = state;
  }

  getActiveState(state: SettingsStateType) {
    return this.activeState === state;
  }

  openEditingDialog() {
    this.isOwnerLoggedIn$
      .pipe(take(1), untilDestroyed(this))
      .subscribe((isOwner) => {
        const dialog = isOwner
          ? this.dialog.open((OwnerEditingDialogComponent), {data: this.networkInfo})
          : this.dialog.open((WorkerEditingDialogComponent), {data: this.coffeeShopInfo});
        dialog.afterClosed().pipe(filter((isHaveChanges) => !!isHaveChanges), take(1))
          .subscribe(() => this.getNetworkInfo());
      });
  }

  getNetworkInfo() {
    this.networkError = '';
    this.getNetworkInfoSub = this.networkSettingsService.getNetworkInfo()
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.networkInfo = res.network;
          this.paymentErrors = res.payment_errors;
          if (res.coffee_shop) {
            this.coffeeShopInfo = res.coffee_shop;
          }
          this.paymentForm.setValue({payment_id: res.network.payment_id});
          this.bonusesPercentage.setValue(res.network.percent_bonus);
          this.network = res;
        },
        (res) => {
          if (res?.errors?.avatar) {
            this.networkError = getBackendMessage(res.errors.avatar);
          } else if (res?.errors?.name) {
            this.networkError = getBackendMessage(res.errors.name);
          } else {
            this.networkError = getBackendMessage(res.message);
          }
        },
      );
  }

  sendNetworkInfo() {
    if (this.form.valid) {
      this.sendNetworkInfoSub = this.networkSettingsService.sendNetworkInfo(this.form.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
          this.getNetworkInfo();
        }, (res) => this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message))));
    }
  }

  sendBonusesPercentage() {
    if (this.bonusesPercentage.valid) {
      this.sendBonusesPercentageSub = this.networkSettingsService.sendBonusesPercentage(
        this.bonusesPercentage.value, this.networkInfo.slug,
      ).pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
          this.getNetworkInfo();
        }, (res) => this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message))));
    }
  }

  sendChangingPassword() {
    if (this.passwordForm.valid) {
      this.notTrueOldPassword = false;
      this.sendChangePasswordSub = this.userStore.changePassword(this.passwordForm.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.changePasswordError = '';
            this.notifier.notify('success', this.translate.instant(marker('Пароль успішно змінено')));
            this.passwordForm.reset();
            this.passwordForm.markAsUntouched();
            this.activeState = SettingsStateType.networkData;
          },
          (res) => {
            if (res.message === 'NotTrueOldPassword') {
              this.notTrueOldPassword = true;
            } else {
              this.changePasswordError = getBackendMessage(res.message);
            }
          });
    }
  }

  setLocalizations(urlCode: string) {
    this.languageService.setLang(urlCode);
    this.cdr.detectChanges();
    this.onSaveChanges.emit();
  }

  setLanguageIcon(languageConfig: LanguageConfig) {
    if (languageConfig) {
      this.setLocalizations(languageConfig.urlCode);
      this.languageIcon = languageConfig.flagIconName;
      this.cdr.markForCheck();
    }
  }

  sendMerchantSettings() {
    if (this.paymentForm.valid) {
      this.sendPaymentDataSub = this.networkSettingsService.sendMerchantSettings(
        this.paymentForm.value, this.networkInfo.slug)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res) => {
            this.notifier.notify('success', 'Налаштування мерчанта успішно збережені');
            this.getNetworkInfo();
          },
          (res) => this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message))),
        );
    }
  }

  openWorkScheduleDialog() {
    this.dialog.open(WorkScheduleDialogComponent);
  }
}
