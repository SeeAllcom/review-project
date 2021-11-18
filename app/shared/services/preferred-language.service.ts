import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG, getSupportedLangs, Lang } from '../helpers/translate.helper';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root',
})
export class PreferredLanguageService {

  constructor(private translateService: TranslateService, private cookie: CookieService) {
  }

  // getInitialLanguage was moved to separate PreferredLanguageService to use location instead or Router
  // Router is not supported inside APP_INITIALIZER deps (see translationInitLoader implementation)
  getInitialLanguage(): Lang {
    const storageLanguage = this.cookie.get('CpLanguage');
    const prevSessionLanguage = this.validateLanguageCode(storageLanguage) ? storageLanguage : null;
    const browserLanguage = this.getBrowserLanguage();
    return prevSessionLanguage || browserLanguage || DEFAULT_LANG;
  }

  private getBrowserLanguage(): Lang {
    return this.validateLanguageCode(this.translateService.getBrowserLang())
      ? this.translateService.getBrowserLang() : null;
  }

  private validateLanguageCode(code: string): boolean {
    return code && getSupportedLangs().includes(code);
  }
}
