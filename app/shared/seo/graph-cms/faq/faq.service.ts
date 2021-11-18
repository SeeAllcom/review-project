import { Injectable } from '@angular/core';
import { FaqCategoryQuery } from './faq.graphql';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Lang } from '../../../helpers/translate.helper';
import { GqlClientService } from '../gql-client.service';
import { FaqCategory, FaqCategoryOrderByInput, QueryFaqCategoriesArgs, Stage } from '../../../../../generated/graphql';

export enum FaqType {
  CoffeePhone = 'faqCategory',
}

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  constructor(private gqlClientService: GqlClientService<QueryFaqCategoriesArgs>) {
  }

  getFaqCategories(language: Lang): Observable<FaqCategory[] | null> {
    return this.load({
      where: {language},
      stage: Stage.Published,
      orderBy: FaqCategoryOrderByInput.OrderAsc,
    }, FaqType.CoffeePhone)
      .pipe(
        map((CMSData) => CMSData.data.faqCategories),
        catchError(() => EMPTY),
      );
  }

  load(variables: any, faqType = FaqType.CoffeePhone) {
    return this.gqlClientService.load<{ faqCategories: FaqCategory[] }>(
      faqType,
      FaqCategoryQuery,
      variables,
    );
  }
}
