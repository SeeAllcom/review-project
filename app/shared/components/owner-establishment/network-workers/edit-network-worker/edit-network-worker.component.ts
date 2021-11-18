import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkEstablishments, WorkerInterface } from '../../helpers/network.helper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { NetworkEstablishmentsService } from '../../../../services/owner/network-establishments.service';
import { Subscription } from 'rxjs';
import { NetworkWorkersService } from '../../../../services/owner/network-workers.service';
import { getLocalizationCityKey } from '../../../../translates/cities-translate.helper';

@UntilDestroy()
@Component({
  selector: 'edit-network-worker',
  templateUrl: './edit-network-worker.component.html',
})
export class EditNetworkWorkerComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
      email: new FormControl(this.worker.email, [Validators.required, Validators.email]),
      name: new FormControl(this.worker.name, [Validators.required]),
      shop: new FormControl(this.worker.pivot.coffee_shop_id, [Validators.required]),
      establishmentSearch: new FormControl([{
        value: '',
        disabled: true,
      }]),
    });
  error: string = '';
  searchEstablishmentValue: string = '';
  establishments: NetworkEstablishments[] = [];
  editingSub = Subscription.EMPTY;

  constructor(
    private formBuilder: FormBuilder,
    private networkEstablishmentsService: NetworkEstablishmentsService,
    private networkWorkersService: NetworkWorkersService,
    private dialogRef: MatDialogRef<EditNetworkWorkerComponent>,
    @Inject(MAT_DIALOG_DATA) public worker: WorkerInterface,
  ) { }

  ngOnInit(): void {
    this.getEstablishment();
  }

  getEstablishment() {
    this.networkEstablishmentsService.getEstablishment()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
          this.establishments = res.areas;
        },
        (res) => {
          this.error = getBackendMessage(res.message);
        },
      );
  }

  editWorker() {
    if (this.form.valid) {
      this.editingSub = this.networkWorkersService.editWorker(this.form.value, this.worker.id)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.dialogRef.close(true);
          },
          (res) => {
            this.error = getBackendMessage(res.message);
          },
        );
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
