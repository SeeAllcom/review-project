import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NetworkInterface, NetworkKeysInterface } from '../../helpers/networks.helper';
import { RequestMethodsEnum } from '../../helpers/urls.helper';
import { NotifierService } from 'angular-notifier';
import { getBackendMessage } from '../../helpers/errors.helper';
import { CoffeeShopInterface } from '../../components/owner-establishment/helpers/network.helper';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export interface MerchantInterface {
  payment_type: 'merchant_fop';
  payment_id: string;
}

@Injectable()
export class NetworkSettingsService {
  networkData$ = new BehaviorSubject<NetworkKeysInterface | null>(null);
  coffeeShopData$ = new BehaviorSubject<CoffeeShopInterface | null>(null);

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private translate: TranslateService,
  ) {
  }

  getNetworkInfo(): Observable<NetworkInterface> {
    return this.http.get<NetworkInterface>('/api/network/settings').pipe(
      catchError((error) => throwError(error)),
    );
  }

  sendNetworkInfo(info: NetworkKeysInterface): Observable<NetworkKeysInterface> {
    const formData = new FormData();
    const file: File = info.avatar._files[0];
    formData.append('avatar', file, file.name);
    formData.append('name', info.name);
    formData.append('instagram', info.instagram);
    formData.append('facebook', info.facebook);
    formData.append('description', info.description);
    return this.http.post<NetworkKeysInterface>('/api/network/settings', formData)
      .pipe(
        tap((res) => {
          this.networkData$.next(res.chain_cafe);
          if (getBackendMessage(res.message)) {
            this.notifierService.notify('success', getBackendMessage(res.message));
          }
        }),
        catchError((error) => throwError(error)),
      );
  }

  updateNetworkInfo(info: NetworkKeysInterface, slug: string): Observable<NetworkKeysInterface> {
    const formData = new FormData();
    if (info.avatar._files) {
      const file: File = info.avatar._files[0];
      formData.append('avatar', file, file.name);
      info.avatar = file.name;
    }
    formData.append('name', info.name);
    formData.append('instagram', info.instagram);
    formData.append('facebook', info.facebook);
    formData.append('description', info.description);
    formData.append('inaccessible', info.inaccessible ? '1' : '0');
    formData.append('_method', RequestMethodsEnum.Update);
    return this.http.post<NetworkKeysInterface>('/api/network/settings/' + slug, formData)
      .pipe(
        tap((res) => {
          if (res.message && res.chain_cafe) {
            this.notifierService.notify('success', getBackendMessage(res.message));
            this.networkData$.next(res.chain_cafe);
          }
        }),
        catchError((error) => throwError(error)),
      );
  }

  updateEstablishmentInfo(info: any, id: number): Observable<{coffee_shop: CoffeeShopInterface}> {
    const formData = new FormData();
    if (info.img._files) {
      const file: File = info.img._files[0];
      formData.append('img', file, file.name);
      info.img = file.name;
    }
    formData.append('address', info.address);
    formData.append('region_id', info.region_id);
    formData.append('_method', RequestMethodsEnum.Update);
    return this.http.post<{coffee_shop: CoffeeShopInterface}>('/api/network/coffee-shops/' + id, formData).pipe(
        tap((res) => {
          if (res.coffee_shop) {
            this.notifierService.notify(
              'success', this.translate.instant(marker('Дані про заклад успішно змінені')));
          }
        }),
        catchError((error) => throwError(error)),
      );
  }

  sendMerchantSettings(form: MerchantInterface, slug: string) {
    form['only_payment_data'] = true;
    return this.http.put<NetworkKeysInterface>('/api/network/settings/' + slug, form);
  }

  sendBonusesPercentage(bonusesPercentage: string, slug: string) {
    const body = {
      only_percent_bonus: true,
      percent_bonus: bonusesPercentage,
    };
    return this.http.put<NetworkKeysInterface>('/api/network/settings/' + slug, body);
  }
}
