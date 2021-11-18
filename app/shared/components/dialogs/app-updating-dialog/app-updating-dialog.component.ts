import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-updating-dialog',
  templateUrl: './app-updating-dialog.component.html',
  styleUrls: ['./app-updating-dialog.component.scss'],
})
export class AppUpdatingDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AppUpdatingDialogComponent>,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  ngOnInit(): void {
  }

  updateApp() {
    if (isPlatformBrowser(this.platform)) {
      window.location.reload(true);
      this.dialogRef.close();
    }
  }
}
