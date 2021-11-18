import {
  TranslateDefaultParser,
} from '@ngx-translate/core';

export class InterpolatedTranslateParser extends TranslateDefaultParser {
  public templateMatcher: RegExp = /{\s?([^{}\s]*)\s?}/g;
}
