import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkSettingsService } from '../../../../services/owner/network-settings.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkKeysInterface } from '../../../../helpers/networks.helper';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { environment } from '../../../../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'owner-editing-dialog',
  templateUrl: './owner-editing-dialog.component.html',
})
export class OwnerEditingDialogComponent implements OnInit {
  data = this.networkData;
  form: FormGroup = new FormGroup({
    avatar: new FormControl(this.data.avatar.toString(), [Validators.required]),
    name: new FormControl(this.data.name, [Validators.required]),
    work_schedule: new FormControl(this.data.work_schedule ? this.data.work_schedule : ''),
    instagram: new FormControl(this.data.instagram ? this.data.instagram : ''),
    facebook: new FormControl(this.data.facebook ? this.data.facebook : ''),
    description: new FormControl(this.data.description ? this.data.description : ''),
    inaccessible: new FormControl(this.data.inaccessible),
  });
  sendSub = Subscription.EMPTY;
  error: string = '';
  API_URL = environment.API_URL;

  constructor(
    @Inject(MAT_DIALOG_DATA) public networkData: NetworkKeysInterface,
    private networkSettingsService: NetworkSettingsService,
    private dialog: MatDialogRef<OwnerEditingDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  send() {
    this.error = '';
    if (this.form.valid) {
      this.sendSub = this.networkSettingsService.updateNetworkInfo(this.form.value, this.networkData.slug)
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
}
