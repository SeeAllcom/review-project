import { Component, OnInit } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthComponent } from '../auth.component';
import { AuthTabsTypeEnum } from '../state/auth-header.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthHeaderService } from '../state/auth-header.service';
import { throwError } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../../helpers/errors.helper';

@UntilDestroy()
@Component({
  selector: 'confirmed-email',
  templateUrl: './confirmed-email.component.html',
  styleUrls: ['./confirmed-email.component.scss'],
})
export class ConfirmedEmailComponent implements OnInit {
  token$ = this.route.params.pipe(map((params) => params.token));
  error: string = '';
  message: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private authHeaderService: AuthHeaderService,
  ) { }

  ngOnInit(): void {
    this.getToken();
    if (this.token) {
      this.sendConfirmationEmail(this.token)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(
          (res: any) => {
            this.message = getBackendMessage(res.message);
          },
          (res) => {
            this.error = getBackendMessage(res.message);
          },
        );
    }
  }

  getToken() {
    this.token$.pipe(take(1), untilDestroyed(this)).subscribe(
      (token) => this.token = token,
    );
  }

  sendConfirmationEmail(token: string) {
    return this.http.post('/api/register/confirmed-email/' + token, '').pipe(
      catchError((error) => throwError(error)),
    );
  }

  openLoginDialog() {
    this.router.navigate(['/']).then(() => {
      this.dialog.open(AuthComponent);
      this.authHeaderService.changeTab(AuthTabsTypeEnum.Login);
    });
  }
}
