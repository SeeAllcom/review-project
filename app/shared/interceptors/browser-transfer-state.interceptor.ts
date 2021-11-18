import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class BrowserTransferStateInterceptor implements HttpInterceptor {

  constructor(
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.platform)) {
      if (req.method === 'GET') {
        const key = makeStateKey(req.urlWithParams);
        const storedResponse: string = this.transferState.get(key, null);
        if (storedResponse) {
          const response = new HttpResponse({ body: storedResponse });
          this.transferState.remove(key);
          return of(response);
        }
      }
    }

    return next.handle(req);
  }
}
