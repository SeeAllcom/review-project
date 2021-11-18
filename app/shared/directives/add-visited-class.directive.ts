import {
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WINDOW } from '../helpers/window-ref';

@UntilDestroy()
@Directive({
  selector: '[addVisitedClass]',
})
export class AddVisitedClassDirective {
  @HostBinding('class.isVisited') isVisited!: boolean;
  eventSubscription = Subscription.EMPTY;
  debounceTime = 15;
  indentFromBottom: number = 20;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platform: any,
    @Inject(WINDOW) private window: Window,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platform)) {
      this.eventSubscription = fromEvent(window, 'scroll', {passive: true })
        .pipe(
          debounceTime(this.debounceTime),
          untilDestroyed(this),
        ).subscribe(() => this.checkScroll());
    }
    setTimeout(() => this.checkScroll(), this.debounceTime);
  }

  ngOnDestroy() {
    this.removeListener();
  }

  private checkScroll() {
    if (isPlatformBrowser(this.platform)) {
      const viewportHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0,
      );

      const tablets = 768;
      const indentFromBottomDesktop = 150;

      if (window.innerWidth > tablets) {
        this.indentFromBottom = indentFromBottomDesktop;
      }

      const elementTopPos = this.el.nativeElement.getBoundingClientRect().top + window.scrollY;
      this.isVisited = window.pageYOffset > elementTopPos - viewportHeight + this.indentFromBottom;
      if (this.isVisited) {
        this.removeListener();
        this.cdr.markForCheck();
      }
    }
  }

  private removeListener() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
