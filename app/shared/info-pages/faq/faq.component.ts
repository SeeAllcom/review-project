import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FaqCategory } from '../../../../generated/graphql';
import { TranslateService } from '@ngx-translate/core';
import { SeoPageName } from '../../seo/models/page-name.enum';
import { PageMetaService } from '../../seo/graph-cms/page-meta/page-meta.service';

@Component({
  selector: 'faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit {
  currentSection = '';
  categories: FaqCategory[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private deviceDetectorService: DeviceDetectorService,
    private viewportScroller: ViewportScroller,
    private pageMetaService: PageMetaService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit(): void {
    this.pageMetaService.initTags(SeoPageName.FaqPage);
    this.getCategories(this.route.snapshot.data['categories']);
    if (isPlatformBrowser(this.platform)) {
      const firstArticle = this.categories[0].faqArticles[0];
      const articleFromHash = location.hash.replace(/^#/, '');
      this.currentSection = articleFromHash || firstArticle.articleId;
      if (articleFromHash || this.deviceDetectorService.isDesktop()) {
        this.viewportScroller.scrollToAnchor(this.currentSection);
      }
    }
  }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  isPwaApp(): boolean {
    if (isPlatformBrowser(this.platform)) {
      return (window.matchMedia('(display-mode: standalone)').matches)
        || ('standalone' in window.navigator)
        && (window.navigator['standalone'])
        || document.referrer.includes('android-app://');
    } else {
      return false;
    }
  }

  private getCategories(categories: FaqCategory[]) {
    this.categories = categories;
    this.cdr.detectChanges();
  }
}
