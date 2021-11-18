import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

declare var Hammer: any;

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      touchAction: 'auto',
    });
  }
}
