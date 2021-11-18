import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'work-schedule-dialog',
  templateUrl: './work-schedule-dialog.component.html',
})
export class WorkScheduleDialogComponent implements OnInit {
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<WorkScheduleDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  setWorkSchedule() {
    console.log(this.form.value);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
