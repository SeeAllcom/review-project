import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

const unauthorizedMessage = 'Unauthenticated.';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getToken()) {
      request = this.addToken(request, this.authService.getToken());
    }

    return next.handle(request).pipe(catchError((response: HttpErrorResponse) => {
      if (response.message === unauthorizedMessage) {
        this.handle401Error(request, next);
      }
      return throwError(response);
    }));
  }

  addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshingToken().pipe(
        switchMap((refreshRes) => {
          if (refreshRes && refreshRes.error === 'invalid_request') {
            this.authService.showUnauthenticatedMessage(unauthorizedMessage);
            return next.handle(this.addToken(request, null));
          }
          this.isRefreshing = false;
          this.authService.setTokens(refreshRes);
          this.refreshTokenSubject.next(refreshRes.access_token);
          return next.handle(this.addToken(request, refreshRes.access_token));
        })).subscribe();

    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
}
