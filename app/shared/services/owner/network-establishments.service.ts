import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  CoffeeShopInterface,
  EstablishmentLocationInterface, NetworksEstablishments,
} from '../../components/owner-establishment/helpers/network.helper';
import { catchError, tap } from 'rxjs/operators';
import { RequestMethodsEnum } from '../../helpers/urls.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@Injectable()
export class NetworkEstablishmentsService {

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private translate: TranslateService,
  ) {
  }

  addEstablishment(establishment: EstablishmentLocationInterface): Observable<EstablishmentLocationInterface> {
    const formData = new FormData();
    const file: File = establishment.img._files[0];
    formData.append('address', establishment.address);
    formData.append('region_id', establishment.region.id.toString());
    formData.append('img', file, file.name);
    return this.http.post<EstablishmentLocationInterface>('/api/network/coffee-shops', formData).pipe(
      tap(() => {
        this.notifierService.notify(
          'success',
          `
          ${this.translate.instant(marker('Кав\'ярня в місті '))}
          ${establishment.region.name}
          ${this.translate.instant(marker(' успішно додана.'))}
          `);
      }),
      catchError((error) => throwError(error)),
    );
  }

  getEstablishment(): Observable<NetworksEstablishments> {
    return this.http.get<NetworksEstablishments>('/api/network/coffee-shops/regions').pipe(
      catchError((error) => throwError(error)),
    );
  }

  getEstablishmentsForSomeCity(regionId: number): Observable<NetworksEstablishments> {
    return this.http.get<NetworksEstablishments>(`/api/network/coffee-shops/regions/${regionId}`).pipe(
      catchError((error) => throwError(error)),
    );
  }

  deleteEstablishment(establishment: CoffeeShopInterface) {
    return this.http.delete('/api/network/coffee-shops/' + establishment.id).pipe(
      tap(() => this.notifierService.notify(
        'success',
        `
        ${this.translate.instant(marker('Кав\'ярня на '))}
        ${establishment.address}
        ${this.translate.instant(marker(' успішно видалена.'))}
         `)),
      catchError((error) => throwError(error)),
    );
  }

  updateEstablishment(establishment: EstablishmentLocationInterface, establishmentId: number) {
    const formData = new FormData();
    formData.append('address', establishment.address);
    formData.append('region_id', establishment.region_id.toString());
    formData.append('_method', RequestMethodsEnum.Update);
    if (establishment.img._files) {
      const file: File = establishment.img._files[0];
      formData.append('img', file, file.name);
    }

    return this.http.post<EstablishmentLocationInterface>(`/api/network/coffee-shops/${establishmentId}`, formData)
      .pipe(
        tap(() => this.notifierService.notify('success',
          this.translate.instant(marker('Кав\'ярня успішно оновлена.')))),
        catchError((error) => throwError(error),
        ),
      );
  }
}
