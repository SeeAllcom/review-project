import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkSettingsService } from '../../../../services/owner/network-settings.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { CoffeeShopInterface } from '../../helpers/network.helper';

@UntilDestroy()
@Component({
  selector: 'worker-editing-dialog',
  templateUrl: './worker-editing-dialog.component.html',
})
export class WorkerEditingDialogComponent implements OnInit {
  form: FormGroup = new FormGroup({
    img: new FormControl(this.establishmentData.img, [Validators.required]),
    address: new FormControl(this.establishmentData.address, [Validators.required]),
    region_id: new FormControl(this.establishmentData.region.id, [Validators.required]),
    establishmentSearch: new FormControl(''),
  });
  sendSub = Subscription.EMPTY;
  getCitiesSub = Subscription.EMPTY;
  error: string = '';
  API_URL = environment.API_URL;
  url = this.API_URL + this.establishmentData.img;

  constructor(
    @Inject(MAT_DIALOG_DATA) public establishmentData: CoffeeShopInterface,
    private networkSettingsService: NetworkSettingsService,
    private dialog: MatDialogRef<WorkerEditingDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  send() {
    this.error = '';
    if (this.form.valid) {
      this.sendSub = this.networkSettingsService.updateEstablishmentInfo(
        this.form.value, this.establishmentData.id)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(
          () => this.dialog.close(true),
          (res) => {
            if (res.errors && res.errors.avatar) {
              this.error = getBackendMessage(res.errors.avatar);
            } else {
              this.error = getBackendMessage(res.message);
            }
          },
        );
    }
  }

  closeDialog() {
    this.dialog.close(false);
  }
}
