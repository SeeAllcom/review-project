import { Injectable } from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRouteSnapshot, ActivationEnd, Params, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class RootUrlService {
  private params = new BehaviorSubject<Params>({});
  private queryParams = new BehaviorSubject<Params>({});
  private url = new BehaviorSubject<string>('');
  url$ = this.url.asObservable();

  constructor( private router: Router) {
    this.startRouterShareListener();
  }

  checkNeededPage(neededPage: string | string[]) {
    return this.url$.pipe(
      map((currentPage) => {
        return Array.isArray(neededPage)
          ? neededPage.some((page) => currentPage.includes(page))
          : currentPage.includes(neededPage);
        },
      ),
    );
  }

  excludeNonSeoQueryParams(router: Router, url: string): string {
    const urlTree = router.parseUrl(url);
    const page = urlTree.queryParams.page;
    const rootUrl = url.split('?')[0];
    if (page) {
      return rootUrl + '?page=' + page;
    } else {
      return rootUrl;
    }
  }

  private startRouterShareListener() {
    this.router.events
      .pipe(
        tap(() => this.urlChangeListener()),
        // @ts-ignore
        filter((val) => this.isValidParams(val)),
      )
      .subscribe((snapshot: ActivatedRouteSnapshot | any) => {
        this.params.next(snapshot.params);
        this.queryParams.next(snapshot.queryParams);
      });
  }

  private urlChangeListener() {
    const newUrl = this.excludeNonSeoQueryParams(this.router, this.router.url);
    if (newUrl !== this.url.value) {
      this.url.next(this.excludeNonSeoQueryParams(this.router, newUrl));
    }
  }

  private isValidParams(val: Event): boolean {
    return (
      val instanceof ActivationEnd && this.isParamsExist(val.snapshot.params)
    );
  }

  private isParamsExist(params: Params): boolean {
    return params && Object.keys(params).length > 0;
  }
}
