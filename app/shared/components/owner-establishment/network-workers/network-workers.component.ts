import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNetworkWorkerComponent } from './add-network-worker/add-network-worker.component';
import { filter, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkWorkersService } from '../../../services/owner/network-workers.service';
import { WorkerInterface } from '../helpers/network.helper';
import { Subscription } from 'rxjs';
import { ConfirmDeleteDialogComponent } from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { getLocalizationCityKey } from '../../../translates/cities-translate.helper';
import { TranslateService } from '@ngx-translate/core';
import { EditNetworkWorkerComponent } from './edit-network-worker/edit-network-worker.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@UntilDestroy()
@Component({
  selector: 'network-workers',
  templateUrl: './network-workers.component.html',
  styleUrls: ['./network-workers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NetworkWorkersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchAddressValue: string = '';
  workers: WorkerInterface[] = [];
  getWorkersSub = Subscription.EMPTY;
  searchInputVisible: boolean = false;
  dataSource: any = new MatTableDataSource<WorkerInterface>([]);
  filterValues = {};

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private networkWorkersService: NetworkWorkersService,
  ) {
  }

  ngOnInit(): void {
    this.getWorkers();
  }

  sortData(sort: Sort) {
    const data = this.workers.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      const translatedCityA = this.translate.instant(getLocalizationCityKey(a.coffee_shops[0].region.name));
      const translatedCityB = this.translate.instant(getLocalizationCityKey(b.coffee_shops[0].region.name));
      switch (sort.active) {
        case 'date':
          return this.compare(a.created_at, b.created_at, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'address':
          return this.compare(translatedCityA, translatedCityB, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(value): void {
    this.filterValues = value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  private createFilter(): any {
    return (data: any, filterEl: string): boolean => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      data.coffee_shops.forEach((shop) =>
        shop.region.name = this.translate.instant(getLocalizationCityKey(shop.region.name_en)));
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filterEl.trim().toLowerCase().toString().replace(/['"]+/g, '');
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  private nestedFilterCheck(search, data, key): any {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

  toggleSearchVisibility(isClearInputValue: boolean) {
    this.searchInputVisible = !this.searchInputVisible;
    if (isClearInputValue) {
      this.searchAddressValue = '';
      this.dataSource.filter = '';
      this.filterValues = {};
    }
  }

  hiddenSearchWorkers() {
    this.searchInputVisible = false;
    this.searchAddressValue = '';
    this.dataSource.filter = '';
    this.filterValues = {};
  }

  getWorkers() {
    this.getWorkersSub = this.networkWorkersService.getAllWorkers()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
        this.workers = res.workers;
        this.dataSource.data = res.workers;
        this.dataSource.package = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
        this.hiddenSearchWorkers();
      });
  }

  openAddWorkerDialog() {
    this.dialog.open(AddNetworkWorkerComponent).afterClosed()
      .pipe(filter((state) => !!state), take(1), untilDestroyed(this))
      .subscribe(() => this.getWorkers());
  }

  openDeleteWorkerDialog(worker: WorkerInterface) {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        deleteFunc: () => this.networkWorkersService.deleteWorker(worker),
      },
    }).afterClosed()
      .pipe(filter((state) => !!state), take(1), untilDestroyed(this))
      .subscribe(() => this.getWorkers());
  }

  editWorker(worker: WorkerInterface) {
    this.dialog.open(EditNetworkWorkerComponent, {data: worker})
      .afterClosed()
      .pipe(filter((state) => !!state), take(1), untilDestroyed(this))
      .subscribe(() => this.getWorkers());
  }
}
