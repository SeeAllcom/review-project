import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  WorkerInterface,
  WorkersInterface,
} from '../../components/owner-establishment/helpers/network.helper';
import { catchError, tap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { RequestMethodsEnum } from '../../helpers/urls.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class NetworkWorkersService {

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private translate: TranslateService,
  ) {
  }

  getAllWorkers(): Observable<WorkersInterface> {
    return this.http.get<WorkersInterface>('api/network/workers');
  }

  deleteWorker(worker: WorkerInterface) {
    return this.http.delete(`/api/network/workers/${worker.id}`).pipe(
      tap(() => {
        this.notifierService.notify(
          'success',
          `
            ${this.translate.instant(marker('Працівник '))}
            ${worker.name}
            ${this.translate.instant(marker(' успішно видалений.'))}
          `);
      }),
      catchError((error) => throwError(error)),
    );
  }

  addWorker(worker: WorkerInterface): Observable<WorkerInterface> {
    return this.http.post<WorkerInterface>('/api/network/workers', worker).pipe(
      tap((res) => {
        this.notifierService.notify(
          'success',
          `
          ${this.translate.instant(marker('Працівник '))}
          ${res.created_worker.name}
          ${this.translate.instant(marker(' успішно доданий.'))}
          `);
      }),
      catchError((error) => throwError(error)),
    );
  }

  editWorker(worker: WorkerInterface, workerId: number): Observable<WorkerInterface> {
    return this.http.put<WorkerInterface>('/api/network/workers/' + workerId, worker).pipe(
      tap((res: any) => {
        this.notifierService.notify(
          'success',
          `
          ${this.translate.instant(marker('Працівник '))}
          ${res.worker.name}
          ${this.translate.instant(marker(' успішно відредагований.'))}
          `);
      }),
      catchError((error) => throwError(error)),
    );
  }
}
