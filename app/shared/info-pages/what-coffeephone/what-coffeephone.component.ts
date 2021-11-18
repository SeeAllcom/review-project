import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LanguageDialogComponent } from '../../components/language-dialog/language-dialog.component';
import { FLAGS_SPRITE } from '../../helpers/variables.helper';
import { LANGUAGES } from '../../helpers/translate.helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LanguageService } from '../../services/language.service';
import { AuthComponent } from '../../components/login/auth.component';
import { AuthTabsTypeEnum } from '../../components/login/state/auth-header.model';
import { AuthHeaderStore } from '../../components/login/state/auth-header.store';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { LandingFormType, LandingService } from '../services/landing.service';
import { take } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { getBackendMessage } from '../../helpers/errors.helper';
import { Subscription } from 'rxjs';
import { SeoPageName } from '../../seo/models/page-name.enum';
import { PageMetaService } from '../../seo/graph-cms/page-meta/page-meta.service';

@UntilDestroy()
@Component({
  selector: 'what-coffeephone',
  templateUrl: './what-coffeephone.component.html',
  styleUrls: ['./what-coffeephone.component.scss'],
})
export class WhatCoffeephoneComponent implements OnInit {
  readonly authTabsType = AuthTabsTypeEnum;
  flagsSpriteName = FLAGS_SPRITE;
  languages = LANGUAGES;
  flagIconName: string = '';
  error: string = '';
  sendMailSub = Subscription.EMPTY;
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    typeForm: new FormControl(LandingFormType.user),
  });

  constructor(
    private dialog: MatDialog,
    private notifier: NotifierService,
    private languageService: LanguageService,
    private authHeaderStore: AuthHeaderStore,
    private translate: TranslateService,
    private meta: Meta,
    private title: Title,
    private landingService: LandingService,
    private pageMetaService: PageMetaService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit(): void {
    this.updateSeoMeta();
  }

  updateSeoMeta() {
    this.pageMetaService.initTags(SeoPageName.WelcomeUserPage);
  }

  openRegistrationDialog() {
    this.dialog.open(AuthComponent);
    this.authHeaderStore.setTab(this.authTabsType.SignUp);
  }

  setCurrentLanguage() {
    this.languageService.currentLanguage$
      .pipe(untilDestroyed(this))
      .subscribe((language) => {
        this.flagIconName = this.languages[language].flagIconName;
      });
  }

  openLocalizationDialog() {
    this.dialog.open(LanguageDialogComponent);
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

  sendMail() {
    if (this.form.valid) {
      this.sendMailSub = this.landingService.sendMail(this.form.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.notifier.notify('success', this.translate.instant(
              marker('Ваше повідомлення успішно надіслане. Очікуйте на відповідь'),
            ));
            this.form.reset();
          },
          (res) => {
            this.error = getBackendMessage(res.message);
          });
    }
  }
}
