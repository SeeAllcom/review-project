import { MetaDefinition } from '@angular/platform-browser';
import { LinkDefinition } from '../../html-tags/link.service';

export interface IMetaObj {
  title: string;
  meta?: MetaDefinition[];
  links?: LinkDefinition[];
}
