import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Lang } from '../helpers/translate.helper';
import { take } from 'rxjs/operators';
import { HtmlClassAndAttributeService } from '../seo/html-tags/html-class-and-lang-attribute.service';
import { PreferredLanguageService } from './preferred-language.service';
import { CookieService } from 'ngx-cookie';

@Injectable({providedIn: 'root'})
export class LanguageService {
  currentLanguageSubject$ = new BehaviorSubject<Lang>(this.chooseInitialLanguage());
  currentLanguage$: Observable<Lang> = this.currentLanguageSubject$.asObservable();

  constructor(
    private cookie: CookieService,
    private translateService: TranslateService,
    private htmlClassAndAttributeService: HtmlClassAndAttributeService,
    private preferredLanguageService: PreferredLanguageService,
  ) {
  }

  get currLang(): Lang {
    return this.currentLanguageSubject$.value;
  }

  private chooseInitialLanguage() {
    return this.preferredLanguageService.getInitialLanguage();
  }

  setInitState() {
    this.setLang(this.chooseInitialLanguage());
  }

  setLang(lang: Lang) {
    if (!this.cookie.get('CpLanguage') || this.cookie.get('CpLanguage') !== lang) {
      this.cookie.put('CpLanguage', lang, {path: '/'});
    }
    this.currentLanguageSubject$.next(lang);
    this.translateService.use(lang).pipe(take(1)).subscribe();
    this.htmlClassAndAttributeService.setHtmlAttribs(lang);
  }
}
