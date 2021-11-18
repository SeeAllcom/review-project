import localeRu from '@angular/common/locales/ru';
import localeUk from '@angular/common/locales/uk';
import { registerLocaleData } from '@angular/common';
import { InterpolatedTranslateParser } from '../translates/interpolated-translate-parser';

export interface LanguageConfig {
  title: string;
  titleShort: string;
  flagIconName: string;
  urlCode: string;
}

export enum LanguagesCodesEnum {
  Russia = 'ru',
  Ukraine = 'uk',
}

export const DEFAULT_LANG = LanguagesCodesEnum.Russia;

export type Lang = keyof typeof LANGUAGES;

export const LANGUAGES: {[l in string]: LanguageConfig} = {
  ru: {title: 'Русский', titleShort: 'Рус', flagIconName: 'russia', urlCode: LanguagesCodesEnum.Russia},
  uk: {title: 'Українська', titleShort: 'Ua', flagIconName: 'ukraine', urlCode: LanguagesCodesEnum.Ukraine},
};

const languageLocales: { [locale in Lang]: any } = {
  ru: localeRu,
  uk: localeUk,
};

Object.keys(LANGUAGES).forEach((languageCode) => {
  const locale = languageLocales[languageCode];
  registerLocaleData(locale, languageCode);
});

export function translateParserFactory() {
  return new InterpolatedTranslateParser();
}

export function getSupportedLangs(): Lang[] {
  return Object.keys(LANGUAGES);
}
