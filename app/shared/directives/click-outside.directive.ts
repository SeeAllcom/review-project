import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  @Output()
  clickOutside = new EventEmitter<Event>();

  @Input() enableClickOutside = true;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event', '$event.target'])
  @HostListener('document:touchend', ['$event', '$event.target']) // for IOS
  onClick(event, targetElement): void {
    if (!targetElement || !this.enableClickOutside) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(event);
      event.stopPropagation(); // for IOS touchend bug fix
    }
  }
}
