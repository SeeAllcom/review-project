import { Inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { Lang } from '../../helpers/translate.helper';

@Injectable({
  providedIn: 'root',
})
export class HtmlClassAndAttributeService {
  private dom = getDOM();

  constructor(
    protected rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platform: any,
  ) {}

  setHtmlClass(className: string) {
    const { htmlTag, renderer } = this.prepareHtmlElement();
    if (!htmlTag) {
      return;
    }
    renderer.addClass(htmlTag, className);
  }

  removeHtmlClass(className: string) {
    const { htmlTag, renderer } = this.prepareHtmlElement();
    if (!htmlTag) {
      return;
    }
    renderer.removeClass(htmlTag, className);
  }

  setHtmlAttribs(langCode: Lang, direction = 'ltr') {
    const { htmlTag, renderer } = this.prepareHtmlElement();
    if (!htmlTag) {
      return;
    }
    renderer.setAttribute(htmlTag, 'lang', langCode);
    renderer.setAttribute(htmlTag, 'dir', direction);
  }

  private prepareHtmlElement() {
    const htmlTag = this.getHtmlElement();
    const renderer = this.rendererFactory.createRenderer(null, null);
    return { htmlTag, renderer };
  }

  private getHtmlElement() {
    if (isPlatformBrowser(this.platform)) {
      const htmlTag = document.querySelector('html');

      if (htmlTag?.tagName !== 'HTML') {
        return null;
      }
      return htmlTag;
    } else {
      return false;
    }
  }
}
