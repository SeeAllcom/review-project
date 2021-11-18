import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FaqService } from '../../seo/graph-cms/faq/faq.service';
import { DEFAULT_LANG, LanguagesCodesEnum } from '../../helpers/translate.helper';
import { FaqCategory } from '../../../../generated/graphql';

@Injectable({ providedIn: 'root' })
export class FaqCategoriesResolver {

  constructor(private faqService: FaqService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FaqCategory[] | null> {
    return this.faqService.getFaqCategories(LanguagesCodesEnum.Ukraine);
  }
}
