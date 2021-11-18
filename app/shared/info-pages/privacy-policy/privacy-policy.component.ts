import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SeoPageName } from '../../seo/models/page-name.enum';
import { PageMetaService } from '../../seo/graph-cms/page-meta/page-meta.service';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    private location: Location,
    private title: Title,
    private translate: TranslateService,
    private meta: Meta,
    private pageMetaService: PageMetaService,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  ngOnInit(): void {
    this.pageMetaService.initTags(SeoPageName.PrivacyPolicy);
  }

  goBack() {
    this.location.back();
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
}
