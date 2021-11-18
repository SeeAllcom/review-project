import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';
import { of, Subscription, throwError } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'application-registration-dialog',
  templateUrl: './application-registration-dialog.component.html',
  styleUrls: ['./application-registration-dialog.component.scss'],
})
export class ApplicationRegistrationDialogComponent implements OnInit {
  sendSub = Subscription.EMPTY;
  isPurchaseFormInvalid: boolean = false;
  checked: boolean = false;
  success: boolean = false;
  error: string = '';
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    coffeeshop_name: new FormControl('', [Validators.required]),
    privacy_policy: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<ApplicationRegistrationDialogComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  sendForm() {
    if (this.form.valid && this.checked) {
      this.isPurchaseFormInvalid = false;
      this.error = '';
      return this.sendSub = this.http.post('/api/registration/send-mail', this.form.value)
        .pipe(take(1),
          untilDestroyed(this),
          catchError((error) => throwError(error)))
        .subscribe(() => {
            const notifierMessage = marker('Заявка успішно відправлена. Очікуйте листа на вашу електронну адресу:');
            this.notifierService.notify(
              'success',
              `${this.translate.instant(notifierMessage)} ${this.form.value.email}`,
            );
            this.dialogRef.close();
          },
          (res) => {
            if (res.errors.email.find((err) => err === 'emailAlreadyExists')) {
              this.error = getBackendMessage('emailAlreadyExists');
            } else {
              this.error = getBackendMessage(res.message);
            }
          });
    } else {
      this.isPurchaseFormInvalid = true;
      return of(false);
    }
  }
}
