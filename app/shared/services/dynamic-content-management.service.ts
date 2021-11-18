import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { LinkDefinition, LinkService } from '../seo/html-tags/link.service';
import { DYNAMIC_CONTENT_CONFIG } from '../helpers/dynamic-content-management.helper';

@Injectable({providedIn: 'root'})
export class DynamicContentManagementService {
  private selectedAppUrl: string = '';
  private readonly dynamicContentConfig = DYNAMIC_CONTENT_CONFIG;

  constructor(private router: Router, private linkService: LinkService) {}

  processNavigationEvent() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe((e: NavigationEnd | any) => {
        const openedAppUrl = this.getOpenedStandaloneApp(e);
        if (this.selectedAppUrl !== openedAppUrl) {
          this.selectedAppUrl = openedAppUrl || '';
          this.setFavicon(this.dynamicContentConfig[this.selectedAppUrl].favIcon);
          this.setPwaIcons(this.dynamicContentConfig[this.selectedAppUrl].pwaIcons);
          this.setStartupImages(this.dynamicContentConfig[this.selectedAppUrl].startupImages);
        }
      });
  }

  private getOpenedStandaloneApp(event: NavigationEnd) {
    return Object.keys(this.dynamicContentConfig).find((url) => event.urlAfterRedirects.includes(url));
  }

  private setFavicon(iconHref: string) {
    this.linkService.removeTag('link[rel=icon]');
    this.linkService.addTag({ href: iconHref, rel: 'icon' });
  }

  private setPwaIcons(icons: LinkDefinition[]) {
    this.linkService.removeTags('link[rel=apple-touch-icon]');
    this.linkService.addTags(icons);
  }

  private setStartupImages(images: LinkDefinition[]) {
    this.linkService.removeTags('link[rel=apple-touch-startup-image]');
    this.linkService.addTags(images);
  }
}
