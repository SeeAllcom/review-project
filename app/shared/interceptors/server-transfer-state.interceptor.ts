import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerTransferStateInterceptor implements HttpInterceptor {

  constructor(private transferState: TransferState) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if ((event instanceof HttpResponse && (event.status === 200 || event.status === 202))) {
          this.transferState.set(makeStateKey(event.url), event.body);
        }
      }),
    );
  }
}
