import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WINDOW } from './window-ref';
import { fromEvent } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({providedIn: 'root'})
export class DeviceService {
  constructor(
    @Inject(PLATFORM_ID) private platform: any,
    @Inject(WINDOW) private window: Window,
  ) {
  }

  initScreenHeight() {
    if (isPlatformBrowser(this.platform)) {
      const vhUnit = 0.01;
      const debounceForInitScreenHeight = 250;
      fromEvent(window, 'resize', { passive: true })
        .pipe(startWith(true), debounceTime(debounceForInitScreenHeight), untilDestroyed(this))
        .subscribe(() =>
          document.documentElement.style.setProperty('--vh', `${window.innerHeight * vhUnit}px`,
          ),
        );
    }
  }
}
