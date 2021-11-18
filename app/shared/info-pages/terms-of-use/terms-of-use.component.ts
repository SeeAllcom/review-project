import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { SeoPageName } from '../../seo/models/page-name.enum';
import { PageMetaService } from '../../seo/graph-cms/page-meta/page-meta.service';

@Component({
  selector: 'terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss'],
})
export class TermsOfUseComponent implements OnInit {

  constructor(
    private location: Location,
    private pageMetaService: PageMetaService,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  ngOnInit(): void {
    this.pageMetaService.initTags(SeoPageName.TermsOfUse);
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
