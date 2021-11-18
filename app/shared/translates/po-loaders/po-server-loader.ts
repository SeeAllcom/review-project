import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { convertTranslateDictionary } from '../../helpers/helpers';

export class PoServerLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(
      import(
        // Its special flags for webpack that include all chunk to one:
        // https://webpack.js.org/api/module-methods/#import-
        /* webpackMode: "eager" */
      '!messageformat-custom-loader!../../../../assets/i18n/' + lang + '.po'),
    ).pipe(
      map((lib) => lib.default),
      map((messageFunctions) => convertTranslateDictionary(messageFunctions)),
      catchError((err, obs) => of({})),
    );
  }
}
