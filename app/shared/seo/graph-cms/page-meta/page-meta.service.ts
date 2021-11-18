import { Inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';
import { SeoPageName } from '../../models/page-name.enum';
import { Observable, Subscription } from 'rxjs';
import { LanguageService } from '../../../services/language.service';
import { PageMeta, PageMetaWhereInput } from '../../../../../generated/graphql';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { Lang } from '../../../helpers/translate.helper';
import { MetaQuery } from './page-meta.qraphql';
import { GqlClientService } from '../gql-client.service';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { LinkDefinition, LinkService } from '../../html-tags/link.service';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IMetaObj } from '../models/meta.model';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { GraphCmsTemplateParserService } from '../parser/graph-cms-template-parser.service';

const EMPTY_SEO_TAGS: IMetaObj = {
  title: 'CoffeePhone | Покупай абонемент на кофе дешевле і получай кэшбек,' +
    ' дари абонемент на кофе друзьям, смотри на карте где ближайшая кофейня',
  meta: [],
};

@Injectable({providedIn: 'root'})
export class PageMetaService {

  constructor(
    private languageService: LanguageService,
    private titleService: Title,
    private meta: Meta,
    private route: ActivatedRoute,
    private linkService: LinkService,
    private translate: TranslateService,
    private gqlClientService: GqlClientService,
    private preparationMetaService: GraphCmsTemplateParserService,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  initTags(pageName: SeoPageName, options?: {}): Subscription {
    return this.fetchPageMeta(pageName).pipe(
      map((meta) => this.prepareTags(meta, options)),
      withLatestFrom(this.route.queryParams),
    ).subscribe(([meta, queryParams]) => {
      const title = this.capitalizeWords(meta.title) + this.getPageNumberForTitle(queryParams.page);
      this.titleService.setTitle(title);
      this.setMetaOnServer(meta.meta, meta.links);
    });
  }

  protected capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, (symbol) => symbol.toUpperCase());
  }

  private getPageNumberForTitle(page: string): string {
    return (!page || page === '1') ? '' : ` | Page ${page}`;
  }

  private prepareTags(meta: PageMeta, options?: {}) {
    const dynamicMeta = this.insertDynamicTags(meta, options);
    return this.initPaginationTags(dynamicMeta, options);
  }

  private insertDynamicTags(meta: PageMeta, options?: {}): IMetaObj {
    const seoTags = this.buildMetaObj(meta);
    return this.preparationMetaService.replaceDynamicTags(seoTags, options);
  }

  private initPaginationTags(meta: IMetaObj, options?: {}): IMetaObj {
    // if (this.metaTagsEmpty()) {
    //   if (options && options.paginationOptions) {
    //     return this.preparationMetaService.addPaginationsTags(meta, options, options.paginationOptions);
    //   }
    // }
    return meta;
  }

  private buildMetaObj(meta: PageMeta): IMetaObj {
    return meta ? {
      title: meta.title || EMPTY_SEO_TAGS.title,
      meta: meta.meta || EMPTY_SEO_TAGS.meta,
    } : EMPTY_SEO_TAGS;
  }

  private setMetaOnServer(metaTags: MetaDefinition[] = [], linkTags: LinkDefinition[] = []) {
    if ((isDevMode() || !isPlatformBrowser(this.platform)) && this.metaTagsEmpty()) {
      if (metaTags) {
        metaTags.forEach((t) => this.meta.updateTag(t));
      }
      if (linkTags) {
        this.linkService.addTags(linkTags);
      }
    }
  }

  private metaTagsEmpty(): boolean {
    return !this.linkService.getTag('rel="canonical"'); // or other specific meta tag
  }

  private fetchPageMeta(page: SeoPageName): Observable<PageMeta> {
    return this.languageService.currentLanguage$.pipe(
      switchMap((lang) => this.getGqlMeta(lang, page)),
    );
  }

  private getGqlMeta(language: Lang, pageId: SeoPageName): Observable<PageMeta> {
    interface GqlResponse {
      pageMetas: PageMeta[];
    }
    const vars: PageMetaWhereInput = {language, pageid: pageId};
    return this.gqlClientService.load<GqlResponse>('pageMeta', MetaQuery, vars).pipe(
      map((gqlResponse) => gqlResponse.data.pageMetas[0]),
    );
  }
}
