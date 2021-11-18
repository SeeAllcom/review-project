import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSideNetwork } from '../helpers/networks.helper';
import {
  CategoriesAndProductsInterface, ProductSupplementsInterface,
  ProductsWithCountInterface,
} from '../helpers/products.helper';
import { tap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
import { SelectedProductsService } from './selected-products.service';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from '../helpers/window-ref';
import { UserOrdersHistoryData } from '../components/dialogs/user-history/user-history.helper';
import { NetworkAbonementResponse } from '../components/owner-establishment/helpers/network-abonements.helper';

@Injectable({providedIn: 'root'})
export class ProductsService {

  constructor(
    private http: HttpClient,
    private notifierService: NotifierService,
    private translate: TranslateService,
    private selectedProductsService: SelectedProductsService,
    @Inject(WINDOW) private globalWindow: Window,
  ) {
  }

  getUserSideNetworkInfo(coffeeNetwork: string): Observable<UserSideNetwork> {
    return this.http.post<UserSideNetwork>(`/api/user-site/network/${coffeeNetwork}?showShops=true`, '');
  }

  getCategoriesWithProducts(coffeeNetwork: string, categoryId?: number): Observable<CategoriesAndProductsInterface> {
    return this.http.get<CategoriesAndProductsInterface>(
      `/api/user-site/network/${coffeeNetwork}/categories${categoryId ? '/' + categoryId : ''}`);
  }

  getAbonements(coffeeNetworkSlug: string): Observable<NetworkAbonementResponse[]> {
    return this.http.get<NetworkAbonementResponse[]>(
      `/api/user-site/network/${coffeeNetworkSlug}/purchasing-abonements`);
  }

  sendOrder(order: ProductsWithCountInterface, useBonuses: boolean) {
    const formData = new FormData();
    formData.append('payment_bonuses', (!useBonuses ? 0 : 1).toString());
    order.order.forEach((product, i) => {
      formData.append(`order[${i}][product_id]`, product.product_id.toString());
      formData.append(`order[${i}][quantity]`, product.quantity.toString());
      product.supplement_options.forEach((option, j) => {
        formData.append(`order[${i}][supplement_options][${j}][id]`, option.id.toString());
        formData.append(`order[${i}][supplement_options][${j}][quantity]`, option.quantity.toString());
      });
    });
    return this.http.post<ProductsWithCountInterface>('/api/user-site/checkout', formData)
      .pipe(tap((res) => {
        this.globalWindow.open(res.dataPayment.response.checkout_url, '_self');
      }));
  }

  sendOrderFromHistory(order: UserOrdersHistoryData) {
    return this.http.get<ProductsWithCountInterface>(`/api/user-site/order/${order.id}/payment`)
      .pipe(tap((res) => this.globalWindow.open(res.dataPayment.response.checkout_url, '_self')));
  }

  getProductSupplements(productId: number): Observable<ProductSupplementsInterface> {
    return this.http.get<ProductSupplementsInterface>('/api/user-site/products/' + productId + '/supplements');
  }
}
