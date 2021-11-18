import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  AllCategoriesInterface,
  CategoriesAndProductsInterface,
  ProductInterface, ProductObjectInterface, ProductSupplementsInterface,
} from '../../helpers/products.helper';
import { RequestMethodsEnum } from '../../helpers/urls.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@Injectable()
export class NetworkProductsService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private notifierService: NotifierService,
  ) {
  }

  getCategoriesWithProduct(): Observable<CategoriesAndProductsInterface> {
    return this.http.get<CategoriesAndProductsInterface>('/api/network/categories').pipe(
      catchError((error) => throwError(error)),
    );
  }

  getAllCategories(): Observable<AllCategoriesInterface> {
    return this.http.get<AllCategoriesInterface>('/api/network/all-categories').pipe(
      catchError((error) => throwError(error)),
    );
  }

  getProductsByCategory(id: number): Observable<ProductObjectInterface> {
    return this.http.get<ProductObjectInterface>(`/api/network/categories/${id}/products`).pipe(
      catchError((error) => throwError(error)),
    );
  }

  addProduct(product: ProductInterface): Observable<ProductInterface> {
    const formData = new FormData();
    this.setAddAndUpdateProductValue(product, formData);
    return this.http.post<ProductInterface>('/api/network/products', formData).pipe(
      tap((res) => {
        if (res.created_product) {
          this.notifierService.notify('success', `
          ${this.translate.instant(marker('Товар '))}
          ${product.name}
          ${this.translate.instant(marker(' успішно добавлений.'))}
          `);
        }
      }),
      catchError((error) => throwError(error)),
    );
  }

  addProductSupplements(
    supplements: ProductSupplementsInterface[],
    productId: number,
    confirmDelete: boolean = false): Observable<ProductSupplementsInterface> {
    const body = { supplements, confirm_delete: confirmDelete };
    return this.http.post<ProductSupplementsInterface>(
      '/api/network/products/' + productId + '/supplements', body).pipe(catchError((error) => throwError(error)));
  }

  updateProduct(product: ProductInterface, productId: number): Observable<{ product: ProductInterface }> {
    const formData = new FormData();
    this.setAddAndUpdateProductValue(product, formData);
    formData.append('inaccessible', (product.inaccessible ? 1 : 0).toString());
    formData.append('hide', (product.hide ? 1 : 0).toString());
    formData.append('_method', RequestMethodsEnum.Update);
    return this.http.post<{ product: ProductInterface }>(`/api/network/products/${productId}`, formData).pipe(
      catchError((error) => throwError(error)),
    );
  }

  setAddAndUpdateProductValue(product: ProductInterface, formData: FormData) {
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('can_purchase_as_abonement', !!product.can_purchase_as_abonement ? '1' : '0');
    formData.append('capacity[size]', product.capacity.size.toString());
    formData.append('capacity[unit]', product.capacity.unit);
    formData.append('category_id', product.category_id.toString());
    if (product.img._files) {
      const file: File = product.img._files[0];
      formData.append('img', file, file.name);
    }
    return formData;
  }

  hideProductToggle(productId: number, productHidden: number) {
    const productSettings = {};
    productSettings['editing_some_items'] = 'true';
    productSettings['hide'] = productHidden.toString();
    return this.http.put<ProductInterface>(`/api/network/products/${productId}`, productSettings).pipe(
      catchError((error) => throwError(error)),
    );
  }

  productNotAvailableToggle(productId: number, productInaccessible: number) {
    const productSettings = {};
    productSettings['editing_some_items'] = 'true';
    productSettings['hide'] = productInaccessible.toString();
    return this.http.put<ProductInterface>(`/api/network/products/${productId}`, productSettings).pipe(
      catchError((error) => throwError(error)),
    );
  }

  deleteProduct(product: ProductInterface, confirmDelete: boolean): Observable<ProductInterface> {
    const params = {};
    if (confirmDelete) {
      params['confirm_delete'] = 1;
    }
    return this.http.delete<ProductInterface | any>(`/api/network/products/${product.id}`, {params}).pipe(
      catchError((error) => throwError(error)),
    );
  }

  getProductSupplements(productId: number): Observable<ProductSupplementsInterface> {
    return this.http.get<ProductSupplementsInterface>('/api/network/products/' + productId + '/supplements');
  }
}
