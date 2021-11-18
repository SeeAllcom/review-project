import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { convertTranslateDictionary } from '../../helpers/helpers';

@Injectable({providedIn: 'root'})

export class PoBrowserLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(
      import(
        // TODO make func to string
        // Проблема в том, что MessageFormat возвращает обьект значениями которых есть функции,
        // заинвестигейтить как функцию преобразовать в стрингу
      '!messageformat-custom-loader!../../../../assets/i18n/' + lang + '.po'),
    ).pipe(
      map((lib) => lib.default),
      map((messageFunctions) => convertTranslateDictionary(messageFunctions)),
      catchError((err, obs) => of({})),
    );
  }
}
