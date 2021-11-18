import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, finalize, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NotifierService } from 'angular-notifier';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

const LONG_LOADING_TIME = 20000;

@Injectable()
export class LongResponseInterceptor implements HttpInterceptor {
  private readonly showMessageEvent = new Subject<void>();

  constructor(
    private notifier: NotifierService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
    this.setUpBrowserNotificationListener();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isRequestToDmBackend = req.url.includes(environment.API_URL);
    if (!isPlatformBrowser(this.platform) || !isRequestToDmBackend) {
      return next.handle(req);
    }
    let isLoading = true;
    setTimeout(() => {
      if (isLoading) {
        this.showMessageEvent.next();
      }
    }, LONG_LOADING_TIME);
    return next.handle(req).pipe(
      catchError((error) => {
        isLoading = false;
        return throwError(error);
      }),
      tap((event) => {
        if (event instanceof HttpResponse) {
          isLoading = false;
        }
      }),
      finalize(() => {
        isLoading = false;
      }),
    );
  }

  private setUpBrowserNotificationListener() {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    let isCoolDown = false;
    this.showMessageEvent.pipe(
      filter(() => !isCoolDown),
    ).subscribe(() => {
      this.showMessage();
      isCoolDown = true;
      const coolDownTime = 60000;
      setTimeout(() => isCoolDown = false, coolDownTime);
    });
  }

  private showMessage() {
    const msg = marker('На CoffeePhone час пік, відповідь на сторінки може зайняти більше часу, ніж зазвичай.' +
      ' Це триватиме недовго, дякую за терпіння.');
    this.notifier.notify('warning', this.translate.instant(msg));
  }
}
