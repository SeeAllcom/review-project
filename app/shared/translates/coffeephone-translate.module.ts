import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MissingTranslationHandler, TranslateLoader, TranslateParser } from '@ngx-translate/core';
import { translateParserFactory } from '../helpers/translate.helper';
import { translateLoaderFactory } from './translate-helper';
import { MissingTranslationService } from '../services/missing-translation-service.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    { provide: TranslateParser, useFactory: translateParserFactory },
    { provide: TranslateLoader, useFactory: translateLoaderFactory },
    { provide: MissingTranslationHandler, useClass: MissingTranslationService },
  ],
})

export class CoffeephoneTranslateModule {
  static forRoot(): ModuleWithProviders<CoffeephoneTranslateModule> {
    return {
      ngModule: CoffeephoneTranslateModule,
    };
  }
}
