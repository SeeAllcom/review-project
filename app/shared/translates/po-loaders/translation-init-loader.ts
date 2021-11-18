import { TranslateLoader } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';

export function translationInitLoader(loader: TranslateLoader, cookie: CookieService) {
  const language = cookie.get('CpLanguage');
  return () => loader.getTranslation(language).toPromise();
}
