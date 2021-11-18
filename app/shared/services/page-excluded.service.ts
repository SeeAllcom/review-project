import { Injectable } from '@angular/core';

const ExcludedRoutesForOwner = [
  '/network',
  '/worker',
  '/maintenance',
];

const ExcludedRoutesHeader = [
  '/network/for-partners',
  'maintenance',
];

@Injectable({providedIn: 'root'})
export class PageExcludedService {

  constructor() { }

  isPageExcluded(page: string): boolean {
    return ExcludedRoutesForOwner.some((route) => page.includes(route));
  }

  isPageExcludedForHeader(page: string): boolean {
    return ExcludedRoutesHeader.some((route) => page.includes(route));
  }
}
