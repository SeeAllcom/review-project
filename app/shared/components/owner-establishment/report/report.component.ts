import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, finalize, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { monthName, NetworkReport, ReportService } from './report.service';
import { NetworkSettingsService } from '../../../services/owner/network-settings.service';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { UserLoginQuery } from '../../../../states/user-login/user-login.query';
import { abonementWriteOff$ } from '../../../helpers/abonements.helper';

@UntilDestroy()
@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  networkData$ = this.networkSettingsService.networkData$;
  isOwnerLoggedIn$ = this.userLoginQuery.isOwnerLoggedIn$;
  report: NetworkReport = null;
  getReportError: string = '';
  reportLoading = false;
  API_URL = environment.API_URL;
  day = new Date();
  maxDate = new Date();
  displayMonth: string;
  monthName = monthName;
  monthIndex: number = 0;
  currentMonth: string = this.monthName[this.day.getMonth()];
  dateForm: FormGroup = new FormGroup({
    startDate: new FormControl(this.day),
    endDate: new FormControl(this.day),
    month: new FormControl(''),
  });
  reportLoaded: boolean = false;

  constructor(
    private reportService: ReportService,
    private userLoginQuery: UserLoginQuery,
    private networkSettingsService: NetworkSettingsService,
  ) {
  }

  ngOnInit(): void {
    this.getReport();
    this.displayMonth = this.monthName[this.day.getMonth()];
    abonementWriteOff$.pipe(
      filter((abonementWriteOff) => abonementWriteOff),
      tap(() => this.reportLoading = true),
      switchMap(() => this.reportService.getReport(this.dateForm.value)),
      finalize(() => abonementWriteOff$.next(false)),
      untilDestroyed(this),
    ).subscribe((res) => {
        this.report = res;
        this.reportLoaded = true;
        this.reportLoading = false;
      },
      (res) => {
        this.getReportError = getBackendMessage(res.message);
        this.reportLoading = false;
      });
  }

  getReport() {
    this.reportLoading = true;
    this.reportService.getReport(this.dateForm.value)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
          this.report = res;
          this.reportLoaded = true;
          this.reportLoading = false;
        },
        (res) => {
          this.getReportError = getBackendMessage(res.message);
          this.reportLoading = false;
        });
  }

  transformToDate(date: string) {
    return new Date(date);
  }

  isDateHaveSameValue() {
    return this.dateForm.controls.startDate.value.toString() === this.dateForm.controls.endDate.value.toString();
  }

  isStartEndDateHaveValue() {
    return this.dateForm.controls.startDate.value && this.dateForm.controls.endDate.value;
  }

  nextMonth() {
    if (!this.isCannotShowNextMonth()) {
      this.monthIndex = +1;
      this.setDateFromJoystick(this.day);
    }
  }

  prevMonth() {
    if (!this.isCannotShowPrevMonth()) {
      this.monthIndex = -1;
      this.setDateFromJoystick(this.day);
    }
  }

  isCannotShowNextMonth() {
    return this.day.getMonth() === this.maxDate.getMonth() && this.day.getFullYear() === this.maxDate.getFullYear();
  }

  isCannotShowPrevMonth() {
    if (this.networkData$.getValue()) {
      const networkCreated = new Date(this.networkData$.getValue().created_at);
      return networkCreated.getMonth() === this.day.getMonth()
        && networkCreated.getFullYear() === this.day.getFullYear();
    } else {
      return false;
    }
  }

  setCurrentMonth() {
    this.monthIndex = 0;
    this.day = new Date();
    this.setDateFromJoystick(this.day);
  }

  setDateFromJoystick(neededDate: Date) {
    const lastDayForAllMonth = 28;
    neededDate.setDate(lastDayForAllMonth);
    neededDate.setMonth(neededDate.getMonth() + this.monthIndex);
    this.displayMonth = this.monthName[neededDate.getMonth()];
    this.dateForm.setValue({
      startDate: '',
      endDate: '',
      month: neededDate,
    });
    this.getReport();
  }

  setDateFromDatepicker() {
    if (!this.dateForm.controls['startDate'].value) {
      this.dateForm.setValue({
        startDate: this.dateForm.controls['endDate'].value,
        endDate: this.dateForm.controls['endDate'].value,
        month: '',
      });
    } else if (!this.dateForm.controls['endDate'].value) {
      this.dateForm.setValue({
        startDate: this.dateForm.controls['startDate'].value,
        endDate: this.dateForm.controls['startDate'].value,
        month: '',
      });
    } else {
      this.dateForm.controls['month'].setValue('');
    }
    this.getReport();
  }
}
