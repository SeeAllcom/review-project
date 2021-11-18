import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { debounceTime, startWith } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

interface WeekDaysInterface {
  dayName: string;
  controlName: string;
}

@UntilDestroy()
@Component({
  selector: 'work-schedule',
  templateUrl: './work-schedule.component.html',
})
export class WorkScheduleComponent implements OnInit {
  @Output() formValue = new EventEmitter();
  @Input() required: boolean = false;
  form: FormGroup = new FormGroup({});
  weekDays: WeekDaysInterface[] = [
    {
      dayName: marker('Понеділок'),
      controlName: 'monday',
    },
    {
      dayName: marker('Вівторок'),
      controlName: 'tuesday',
    },
    {
      dayName: marker('Середа'),
      controlName: 'wednesday',
    },
    {
      dayName: marker('Четвер'),
      controlName: 'thursday',
    },
    {
      dayName: marker('П\'ятниця'),
      controlName: 'friday',
    },
    {
      dayName: marker('Субота'),
      controlName: 'saturday',
    },
    {
      dayName: marker('Неділя'),
      controlName: 'sunday',
    },
  ];
  constructor() { }

  ngOnInit(): void {
    this.buildForm();
    this.form.valueChanges
      .pipe(startWith(true), debounceTime(250), untilDestroyed(this))
      .subscribe(() => this.formValue.emit(this.form));
  }

  buildForm() {
    this.weekDays.forEach((day) => {
      this.form.setControl(day.controlName, new FormGroup({
        start: new FormControl(''),
        end: new FormControl(''),
      }));
      if (this.required) {
        this.form.controls[day.controlName].get('start').setValidators([Validators.required]);
        this.form.controls[day.controlName].get('end').setValidators([Validators.required]);
      }
    });
  }
}
