import { AbstractStorage } from './abstract-storage.interface';

import { CookieServiceSetOptions } from './cookie-service.interface';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class CookieStorage extends AbstractStorage {
  abstract setItem(key: string, value: string, options?: Partial<CookieServiceSetOptions>): void;
}
