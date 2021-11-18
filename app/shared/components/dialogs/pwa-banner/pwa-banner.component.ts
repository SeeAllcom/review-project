import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getUserAgent } from 'universal-user-agent';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CookieService } from 'ngx-cookie';

enum AppBannerState {
  Download = 'downloadTemplate',
  HowToDownload = 'howToDownloadTemplate',
}

@Component({
  selector: 'pwa-banner',
  templateUrl: './pwa-banner.component.html',
  styleUrls: ['./pwa-banner.component.scss'],
})
export class PwaBannerComponent implements OnInit {
  @ViewChild('downloadTemplate', {static: true}) readonly downloadTemplate!: TemplateRef<PwaBannerComponent>;
  @ViewChild('howToDownloadTemplate', {static: true}) readonly howToDownloadTemplate!: TemplateRef<PwaBannerComponent>;
  isShowPwaBanner: boolean = false;
  isIos = this.deviceDetectorService.os === 'iOS';
  readonly bannerTemplate = AppBannerState;
  activeState: AppBannerState = AppBannerState.Download;

  constructor(
    private cookie: CookieService,
    private deviceDetectorService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  ngOnInit(): void {
    this.showInstallPwaDialog();
  }

  showInstallPwaDialog(): void {
    if (isPlatformBrowser(this.platform)) {
      const isIos = getUserAgent().match(/(iPhone|iPod|iPad)/i) && this.isIos;
      if (isIos) {
        this.isShowPwaBanner = !this.cookie.get('pwa-banner-show');
      }
    }
  }

  changeTemplate(template: AppBannerState) {
    this.activeState = template;
  }

  closePwaBanner() {
    this.isShowPwaBanner = false;
    this.cookie.put('pwa-banner-show', 'hidden', {expires: 'session'});
  }
}
