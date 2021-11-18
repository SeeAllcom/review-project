/*
 * -- LinkService --        [Temporary]
 * @MarkPieszak
 *
 * Similar to Meta service but made to handle <link> creation for SEO purposes
 * -- NOTE: Soon there will be an overall DocumentService within Angular that handles Meta/Link everything
 */

/* tslint:disable */

import { Inject, Injectable, RendererFactory2, ViewEncapsulation } from '@angular/core';
// @ts-ignore
import { DOCUMENT, ɵDomAdapter as DomAdapter } from '@angular/common';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private dom: DomAdapter;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.dom = getDOM();
  }

  /**
   * Inject the State into the bottom of the <head>
   */
  addTag(tag: LinkDefinition) {

    try {
      const renderer = this.rendererFactory.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const link = renderer.createElement('link');
      const head = this.document.head;
      const selector = this.parseSelector(tag);

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      Object.keys(tag).forEach((prop: string) => {
        return renderer.setAttribute(link, prop, tag[prop]);
      });

      // [TODO]: get them to update the existing one (if it exists) ? #DMAR-4726
      renderer.appendChild(head, link);

    } catch (e) {
      console.error('Error within linkService : ', e);
    }
  }

  addTags(tags: LinkDefinition[]) {
    tags.forEach((tag) => this.addTag(tag));
  }

  getTags(attrSelector: string): HTMLMetaElement[] {
    if (!attrSelector) return [];
    const list /*NodeList*/ = this.dom.getDefaultDocument().querySelectorAll(`link[${attrSelector}]`);
    return list ? [].slice.call(list) : [];
  }

  getTag(attrSelector: string): HTMLMetaElement | null {
    if (!attrSelector) return null;
    return this.dom.getDefaultDocument().querySelector(`link[${attrSelector}]`) || null;
  }

  public removeTag(tagSelector: string): void {
    const linkElement = <HTMLLinkElement>this.document.head.querySelector(tagSelector);

    if (linkElement) {
      this.document.head.removeChild(linkElement);
    }
  }

  public removeTags(tagSelector: string): void {
    const linkElements = <HTMLLinkElement[]>this.document.head.querySelectorAll(tagSelector);

    if (linkElements && linkElements.length) {
      linkElements.forEach((element) => {
        this.document.head.removeChild(element);
      })
    }
  }

  private parseSelector(tag: LinkDefinition): string {
    // Possibly re-work this
    const attr: string = tag.rel ? 'rel' : 'hreflang';
    return `${attr}="${tag[attr]}"`;
  }
}

export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
  [prop: string]: string;
};
