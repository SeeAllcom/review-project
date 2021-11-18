import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { HtmlClassAndAttributeService } from '../../../seo/html-tags/html-class-and-lang-attribute.service';
import { ViewBreakPoints, ViewBreakpointService } from '../../../services/view-breakpoint.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

const ANIMATION_TIMEOUT = 50;
const BEHAVIOR_SCROLL_CLASS = 'no-smooth-scroll';

@Component({
  selector: 'faq-navigation',
  templateUrl: './faq-navigation.component.html',
})
export class FaqNavigationComponent implements OnInit {
  @Input() faqNavBlock: string;
  @Input() categories: any[] = [];
  arePanelsExpanded = this.viewBreakpointService.isBreakpoint(ViewBreakPoints.MinTablet);

  constructor(
    private viewBreakpointService: ViewBreakpointService,
    private router: Router,
    private htmlClassAndAttributeService: HtmlClassAndAttributeService,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  ngOnInit(): void {
  }

  smoothScrollHandler(index: number) {
    if (!this.categories[index].faqArticles.find((el) => el.articleId === this.faqNavBlock)) {
      this.htmlClassAndAttributeService.setHtmlClass(BEHAVIOR_SCROLL_CLASS);
    }
  }
  forceScrollingOnSameAnchor() {
    if (isPlatformBrowser(this.platform)) {
      const initialOnSameUrlNavigation = this.router.onSameUrlNavigation;
      this.router.onSameUrlNavigation = 'reload';
      const scrollAnimationTime = 1000;
      setTimeout(() => this.router.onSameUrlNavigation = initialOnSameUrlNavigation, scrollAnimationTime);
    }
  }

  ngOnDestroy() {
    this.htmlClassAndAttributeService.removeHtmlClass(BEHAVIOR_SCROLL_CLASS);
  }
}
