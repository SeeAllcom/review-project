import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as _throw, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRolesEnum } from '../helpers/auth-user.helper';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  readonly userRolesEnum = UserRolesEnum;

  constructor(
    private auth: AuthService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((response: HttpErrorResponse) => {
      const accessDeniedStatus = 403;
      if (response.status === accessDeniedStatus && response.error.message === 'NotValidToken') {
        this.auth.showUnauthenticatedMessage('NotValidToken');
      }

      try {
        const errorObj = response.error;

        return observableThrowError(errorObj);
      } catch (e) {
        const errorObj = {
          code: '',
          message: 'Server Error',
        };

        return _throw(errorObj);
      }
    }));
  }
}
