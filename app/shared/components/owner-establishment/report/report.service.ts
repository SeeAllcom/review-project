import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable } from 'rxjs';

export const monthName = [
  marker('Січень'),
  marker('Лютий'),
  marker('Березень'),
  marker('Квітень'),
  marker('Травень'),
  marker('Червень'),
  marker('Липень'),
  marker('Серпень'),
  marker('Вересень'),
  marker('Жовтень'),
  marker('Листопад'),
  marker('Грудень'),
];

export interface NetworkReport {
  coffee_shops: {
    count: number;
    count_areas: number;
    count_regions: number;
  };
  count_commission: number;
  count_money: number;
  count_users_orders: number;
  count_users_visit: number;
  top: {
    coffee_shops: [
      {
        img: string;
        address: string;
        count_products: number;
        region: string;
      }
    ];
    products: [
      {
        name: string;
        quantity: number;
      },
    ];
  };
  used_abonements_count_products: number;
  orders_count_products: number;
  workers: {
    count: number;
    count_not_confirmed: number;
  };
}

export interface ReportFormDate {
  startDate: string;
  endDate: string;
  month: string;
}

@Injectable()
export class ReportService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getConvertDate(date: any, showDays: boolean = true) {
    let neededDate = date ? (new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1)) : '';
    if (showDays && date) {
      neededDate = neededDate + '-' + new Date(date).getDate();
    }
    return neededDate;
  }

  getReport(form: ReportFormDate): Observable<NetworkReport> {
    const startDate = this.getConvertDate(form.startDate);
    const endDate = this.getConvertDate(form.endDate);
    const month = this.getConvertDate(form.month, false);
    return this.http.get<NetworkReport>(
      `/api/network/statistics?start_date=${startDate}&end_date=${endDate}&month=${month}`);
  }
}
