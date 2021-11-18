import { LanguageService } from '../services/language.service';

export class DynamicLocaleId extends String {
  constructor(protected languageService: LanguageService) {
    super('');
  }

  toString() {
    return this.languageService.currLang;
  }
}
