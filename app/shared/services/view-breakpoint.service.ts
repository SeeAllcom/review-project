import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

export enum ViewBreakPoints {
  MaxMobile = '(max-width: 767px)',
  MinTablet = '(min-width: 768px)',
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class ViewBreakpointService {
  constructor(private breakpointObserver: BreakpointObserver) { }

  viewBreakpoint(point: ViewBreakPoints): Observable<boolean> {
    return this.breakpointObserver.observe([point]).pipe(
      map(({ matches }) => matches),
      untilDestroyed(this),
    );
  }

  isBreakpoint(point: ViewBreakPoints): boolean {
    return this.breakpointObserver.isMatched([point]);
  }
}
