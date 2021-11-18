import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({selector: 'input[numbersOnly]'})
export class OnlyNumbersDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit() {
    this.renderer.setAttribute(this.el.nativeElement, 'pattern', '[0-9]*');
    this.renderer.setAttribute(this.el.nativeElement, 'type', 'number');
  }
}
