import { Component, OnInit } from '@angular/core';
import { catchError, map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { throwError } from 'rxjs';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@UntilDestroy()
@Component({
  selector: 'confirmation-registration-establishment',
  templateUrl: './confirmation-registration-establishment.component.html',
  styleUrls: ['./confirmation-registration-establishment.component.scss'],
})
export class ConfirmationRegistrationEstablishmentComponent implements OnInit {
  token$ = this.route.params.pipe(map((params) => params.token));
  error: string = '';
  message: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getToken();
    if (this.token) {
      this.sendConfirmationEmail(this.token)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(
          () => this.message = marker('Ви успішно зареєстрували свій заклад, ми відправили вам ' +
            'ваші дані для входу на вашу електронну адресу,' +
            ' після чого ви зможете увійти в свій обліковий запис.'),
          (res) => this.error = getBackendMessage(res.message),
        );
    }
  }

  getToken() {
    this.token$.pipe(take(1), untilDestroyed(this)).subscribe(
      (token) => this.token = token,
    );
  }

  sendConfirmationEmail(token: string) {
    return this.http.post('/api/registration/confirmation-registration/' + token, '').pipe(
      catchError((error) => throwError(error)),
    );
  }
}
