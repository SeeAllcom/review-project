import { Component, Inject, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';

export interface ConfirmDialogData {
  confirmFunc: () => Observable<any>;
  title: string;
  description: string;
  hint: string;
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  private confirmSub = Subscription.EMPTY;

  constructor(
    private notifier: NotifierService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  confirm() {
    if (this.data && this.data.confirmFunc) {
      this.confirmSub = this.data.confirmFunc()
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => this.dialogRef.close(true),
          (res) => {
            this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          });
    } else {
      this.dialogRef.close(true);
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
