import { Injectable } from '@angular/core';

import { CookieService, CookieServiceSetOptions } from '../interfaces/cookie-service.interface';
import { CookieStorage } from '../interfaces/cookie-storage.interface';

@Injectable({providedIn: 'root'})
export class BaseCookieStorage implements CookieStorage {
  constructor(private cookie: CookieService) {}

  get length(): number {
    return Object.keys(this.cookie.getAll()).length;
  }

  clear(): void {
    this.cookie.removeAll();
  }

  getItem(key: string): string | null {
    const item = this.cookie.get(key);

    return item !== null ? item : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.cookie.getAll());

    return index >= 0 && index < keys.length ? keys[index] : null;
  }

  removeItem(key: string): void {
    this.cookie.remove(key);
  }

  setItem(key: string, data: string, options: Partial<CookieServiceSetOptions> = { path: '/' }): void {
    this.cookie.put(key, data, options);
  }
}
