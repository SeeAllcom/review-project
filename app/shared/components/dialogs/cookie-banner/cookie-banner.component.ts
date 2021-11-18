import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie';

const cookieVersion = 'v1';

@Component({
  selector: 'cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
})
export class CookieBannerComponent implements OnInit {
  isShowCookieBanner: boolean = false;

  constructor(
    private cookie: CookieService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit(): void {
    this.showCookieBanner();
  }

  showCookieBanner(): void {
    if (isPlatformBrowser(this.platform)) {
      this.isShowCookieBanner = !!this.cookie.get('cookie-banner')
        ? this.cookie.get('cookie-banner') !== cookieVersion : !this.cookie.get('cookie-banner');
    }
  }

  closeCookieBanner() {
    this.cookie.put('cookie-banner', cookieVersion);
    this.isShowCookieBanner = false;
  }
}
