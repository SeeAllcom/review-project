import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { LinkService } from '../seo/html-tags/link.service';
import { NETWORK_MAIN_ROUTE } from '../components/owner-establishment/helpers/network.helper';

@Injectable({providedIn: 'root'})
export class ServiceWorkerManifestManagerService {
  private readonly specificManifestConfig = {
    [NETWORK_MAIN_ROUTE]: '/manifest.network-webmanifest',
  };

  private readonly rootManifestPath = '/manifest.webmanifest';

  constructor(private router: Router,
              private linkService: LinkService) {
  }

  changeManifestOnNavigation() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe((e: NavigationEnd | any) => {
      const specificUrl: any = Object.keys(this.specificManifestConfig)
        .find((url) => e.urlAfterRedirects.includes(url));
      if (specificUrl) {
        this.setManifest(this.specificManifestConfig[specificUrl]);
      } else {
        this.setManifest(this.rootManifestPath);
      }
    });
  }

  private setManifest(manifestHref: string): void {
    this.linkService.removeTag('link[rel=manifest]');
    this.linkService.addTag({href: manifestHref, rel: 'manifest'});
  }
}
