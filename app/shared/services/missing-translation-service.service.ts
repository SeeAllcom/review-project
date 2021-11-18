import { Injectable } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateParser } from '@ngx-translate/core';
import { translateParserFactory } from '../helpers/translate.helper';

@Injectable()
export class MissingTranslationService implements MissingTranslationHandler {
  public parser: TranslateParser = translateParserFactory();
  handle(params: MissingTranslationHandlerParams) {
    return this.parser.interpolate(params.key, params.interpolateParams);
  }
}
