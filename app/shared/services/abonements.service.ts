import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AbonementsForOrder,
  EstablishmentWithAbonementsInterface,
  MyAbonementsPageInterface, RequestBodyAbonementInterface, UsedAbonementsInterface,
} from '../helpers/abonements.helper';
import { filter, finalize, tap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { getBackendMessage } from '../helpers/errors.helper';
import { AuthService } from './auth.service';
import { SuccessOrderResponse } from '../helpers/products.helper';

@Injectable({providedIn: 'root'})
export class AbonementsService {
  constructor(
    private http: HttpClient,
    private notifier: NotifierService,
    private translate: TranslateService,
    private auth: AuthService,
  ) {
  }

  getEstablishmentsWithAbonements(): Observable<EstablishmentWithAbonementsInterface> {
    return this.http.get<EstablishmentWithAbonementsInterface>('/api/user-site/abonements/networks');
  }

  getAbonements(slug: string, addBonusesAfterDeletingAbonements = false): Observable<MyAbonementsPageInterface> {
    const params = {showShops: 'true'};
    if (addBonusesAfterDeletingAbonements) {
      params['pick_up_bonuses'] = addBonusesAfterDeletingAbonements;
    }

    return this.http.get<MyAbonementsPageInterface>(`/api/user-site/abonements/network/${slug}`, {params})
      .pipe(finalize(() => {
        if (addBonusesAfterDeletingAbonements) {
          this.notifier.notify('success', this.translate.instant(marker('Бонуси успішно зараховані')));
        }
      }));
  }

  getAbonementsForSuccessOrderPage(queryParams: string): Observable<SuccessOrderResponse> {
    return this.http.get<SuccessOrderResponse>('/api/orders-from-payment/' + queryParams);
  }

  generateAbonementsQrCode(abonements: RequestBodyAbonementInterface[]) {
    const formData = new FormData();
    abonements.forEach((abonement, i) => {
      formData.append(`abonements[${i}][quantity]`, abonement.quantity.toString());
      formData.append(`abonements[${i}][id]`, abonement.supplement.id.toString());
    });
    return this.http.post('/api/user-site/generate-qr-code', formData);
  }

  sengGiftToFriend(abonements: RequestBodyAbonementInterface[], email: string, orderId?: number) {
    const formData = new FormData();
    formData.append('email', email);
    // we send order_id if we give present to friend after purchase
    if (orderId) {
      formData.append('order_id', orderId.toString());
    }
    abonements.forEach((abonement, i) => {
      formData.append(`abonements[${i}][quantity]`, abonement.quantity.toString());
      formData.append(`abonements[${i}][id]`, abonement.supplement.id.toString());
      const supplementOptions = abonement.supplement.supplement_options;
      if (supplementOptions && supplementOptions.length) {
        supplementOptions.forEach((option, j) => {
          formData.append(`abonements[${i}][supplement_options][${j}][name]`, option.name);
          formData.append(`abonements[${i}][supplement_options][${j}][id]`, option.id.toString());
          formData.append(`abonements[${i}][supplement_options][${j}][quantity]`, option.quantity.toString());
          formData.append(
            `abonements[${i}][supplement_options][${j}][price]`,
            option.price ? option.price.toString() : '0',
          );
        });
      }
    });
    return this.http.post<AbonementsForOrder>('/api/user-site/abonements/present', formData).pipe(
      tap((res) => {
        if (res && !res.message && !res.send_mail) {
          this.notifier.notify('warning', this.translate.instant(getBackendMessage('MailAboutAbonementsGiftNotSend')));
        } else if (res.abonements) {
          this.notifier.notify('success',
            this.translate.instant(`${marker('Подарунок користувачу ')} ${email} ${marker(' успішно надісланий')}`));
        }
      }),
    );
  }

  scanQrCodeAbonements(url: string): Observable<UsedAbonementsInterface> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.getToken());
    return this.http.get<UsedAbonementsInterface>(url, {headers});
  }

  writeOffAbonements(abonementToken: string): Observable<UsedAbonementsInterface> {
    return this.http.put<UsedAbonementsInterface>('/api/network/abonements/used/' + abonementToken, {});
  }

  deleteQrCodeForOrderAbonements(abonementToken: string): Observable<UsedAbonementsInterface> {
    return this.http.delete<UsedAbonementsInterface>('/api/network/abonements/used/' + abonementToken);
  }

  deleteQrCodeForOrderAbonementsInUser(abonementToken: string) {
    return this.http.delete('/api/user-site/qr-code/' + abonementToken);
  }
}
