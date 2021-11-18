import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getUserAgent } from 'universal-user-agent';

export enum BrowserNameEnum {
  Edge = 'edge',
  Opera = 'opera',
  Chrome = 'chrome',
  Ie = 'trident',
  Firefox = 'firefox',
  Safari = 'safari',
}

@Injectable({providedIn: 'root'})
export class BrowserCheckerService {
  isEdge: boolean = this.getBrowserName() === BrowserNameEnum.Edge;
  isOpera: boolean = this.getBrowserName() === BrowserNameEnum.Opera;
  isChrome: boolean = this.getBrowserName() === BrowserNameEnum.Chrome;
  isIe: boolean = this.getBrowserName() === BrowserNameEnum.Ie;
  isFirefox: boolean = this.getBrowserName() === BrowserNameEnum.Firefox;
  isSafari: boolean = this.getBrowserName() === BrowserNameEnum.Safari;

  constructor() {
  }

  // tslint:disable-next-line:cyclomatic-complexity
  getBrowserName() {
    const agent = getUserAgent().toLowerCase();
    switch (true) {
      case agent.indexOf(BrowserNameEnum.Edge) > -1:
        return BrowserNameEnum.Edge;
      case agent.indexOf(BrowserNameEnum.Opera) > -1 && !!(window as any).opr:
        return BrowserNameEnum.Opera;
      case agent.indexOf(BrowserNameEnum.Chrome) > -1 && !!(window as any).chrome:
        return BrowserNameEnum.Chrome;
      case agent.indexOf(BrowserNameEnum.Ie) > -1:
        return BrowserNameEnum.Ie;
      case agent.indexOf(BrowserNameEnum.Firefox) > -1:
        return BrowserNameEnum.Firefox;
      case agent.indexOf(BrowserNameEnum.Safari) > -1:
        return BrowserNameEnum.Safari;
      default:
        return 'otherBrowser';
    }
  }
}
