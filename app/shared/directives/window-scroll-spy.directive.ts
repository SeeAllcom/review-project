import {
  Directive,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnInit,
  Output, PLATFORM_ID,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isPlatformBrowser } from '@angular/common';
import { HEADER_HEIGHT } from '../helpers/variables.helper';

@UntilDestroy()
@Directive({
  selector: '[windowScrollSpy]',
})

export class WindowScrollSpyDirective implements OnInit {
  @Input() public spiedClass = '';
  @Input() public changeAnchorOnScroll = false;
  @Output() public sectionChange$ = new EventEmitter<string>();
  private currentSectionId: string;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: any,
    ) {
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const scrollDebounce = 100;
    const parent = this.el.nativeElement as HTMLElement;

    const scrollListener = fromEvent(window, 'scroll');
    scrollListener.pipe(
      debounceTime(scrollDebounce),
      untilDestroyed(this),
    ).subscribe(() => {
      const parentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const parentOffset = parent.offsetTop;
      const spiedSections = document.getElementsByClassName(this.spiedClass);
      let currentSection;
      for (const section of spiedSections as any) {
        if (this.isElementInView(section, parentOffset, parentScrollTop)) {
          currentSection = section;
        }
      }

      if (currentSection.id) {
        this.changeHash(currentSection.id);
      }

      if (currentSection.id !== this.currentSectionId) {
        this.currentSectionId = currentSection.id;
        this.sectionChange$.emit(this.currentSectionId);
      }
    });
  }

  private isElementInView(element: HTMLElement, parentOffset, parentScrollTop): boolean {
    return (element.offsetTop - parentOffset - HEADER_HEIGHT) <= parentScrollTop;
  }

  private changeHash(anchor: string) {
    if (history && history.pushState && this.changeAnchorOnScroll) {
      history.pushState(null, null, location.pathname + '#' + anchor);
    }
  }
}
