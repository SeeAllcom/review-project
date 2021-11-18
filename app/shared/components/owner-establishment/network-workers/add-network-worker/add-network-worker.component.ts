import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkEstablishmentsService } from '../../../../services/owner/network-establishments.service';
import {
  NetworkEstablishments,
} from '../../helpers/network.helper';
import { NotifierService } from 'angular-notifier';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { NetworkWorkersService } from '../../../../services/owner/network-workers.service';
import { matchOtherValidator } from '../../../../helpers/forms.helper';
import { getLocalizationCityKey } from '../../../../translates/cities-translate.helper';
import { fieldsAreEqual } from '../../../../helpers/validators/fields-are-equal.validator';
import { VALIDATION_PASSWORD_REGEXP } from '../../../../helpers/input-validators.helper';

@UntilDestroy()
@Component({
  selector: 'add-network-worker',
  templateUrl: './add-network-worker.component.html',
})
export class AddNetworkWorkerComponent implements OnInit {
  minLengthForPassword = 8;
  error: string = '';
  searchEstablishmentValue: string = '';
  addingSub = Subscription.EMPTY;
  getCitiesSub = Subscription.EMPTY;
  getEstablishmentsSub = Subscription.EMPTY;
  establishments: NetworkEstablishments[] = [];
  form: FormGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.pattern(VALIDATION_PASSWORD_REGEXP)]),
      shop: new FormControl('', [Validators.required]),
      establishmentSearch: new FormControl([{
        value: '',
        disabled: true,
      }]),
    },
    {
      validators: [fieldsAreEqual('password', 'password_confirmation')],
    });

  constructor(
    private dialogRef: MatDialogRef<AddNetworkWorkerComponent>,
    private networkEstablishmentsService: NetworkEstablishmentsService,
    private notifierService: NotifierService,
    private networkWorkersService: NetworkWorkersService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.getEstablishment();
  }

  getLocalizeCityName(name: string) {
    return getLocalizationCityKey(name);
  }

  getEstablishment() {
    this.getEstablishmentsSub = this.networkEstablishmentsService.getEstablishment()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
          this.establishments = res.areas;
        },
        (res) => {
          this.error = getBackendMessage(res.message);
        },
      );
  }

  addWorker() {
    if (this.form.valid) {
      this.addingSub = this.networkWorkersService.addWorker(this.form.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.dialogRef.close(true);
          },
          (res) => {
            if (res?.errors?.email) {
              this.error = getBackendMessage(res.errors.email);
            } else {
              this.error = getBackendMessage(res.message);
            }
          },
        );
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
