import { Directive, ElementRef, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[addPriorityImageBgColor]',
})
export class AddPriorityImageBgColorDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    if (this.el.nativeElement) {
      this.getAverageRGB(this.el.nativeElement);
    }
  }

  // tslint:disable-next-line:cyclomatic-complexity
  getAverageRGB(imgEl: HTMLImageElement): any {
    const blockSize = 5;
    const defaultRGB = {r: 12, g: 15, b: 20};
    const canvas = document.createElement('canvas');
    const context = canvas.getContext && canvas.getContext('2d');
    const rgb = {r: 12, g: 15, b: 20};
    let data;
    let width;
    let height;
    let i = -4;
    let length;
    let count = 0;

    if (!context) {
      return defaultRGB;
    }

    height = canvas.height = imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.offsetWidth || imgEl.width;

    const image = new Image();
    image.src = imgEl.getAttribute('src');
    image.addEventListener('load', () => {
      context.drawImage(image, 0, 0);
    });

    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = Math.floor(rgb.r / count);
    rgb.g = Math.floor(rgb.g / count);
    rgb.b = Math.floor(rgb.b / count);

    this.renderer.setAttribute(imgEl, 'style', `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b})`);
  }
}
