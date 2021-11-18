import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserRolesEnum } from '../../helpers/auth-user.helper';
import { AuthService } from '../../services/auth.service';

@Injectable({providedIn: 'root'})
export class UserAuthGuard implements CanActivate, CanActivateChild {
  userRolesEnum = UserRolesEnum;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isAuthenticated() && this.auth.getRole() === this.userRolesEnum.User) {
      return of(true);
    } else {
      this.router.navigate(['/']).then();
      return of(false);
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
