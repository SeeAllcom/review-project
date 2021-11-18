import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AddToCartProductInterface, ProductOperationTypeEnum,
  ProductSupplementInterface,
} from '../../../helpers/products.helper';
import { environment } from '../../../../../environments/environment';
import { SelectedProductsService } from '../../../services/selected-products.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductsService } from '../../../services/products.service';

interface ProductsData {
  product: AddToCartProductInterface;
  operationType: ProductOperationTypeEnum;
}

@UntilDestroy()
@Component({
  selector: 'product-preview',
  templateUrl: './product-preview.component.html',
})
export class ProductPreviewComponent implements OnInit, OnDestroy {
  readonly operationType = ProductOperationTypeEnum;
  product: AddToCartProductInterface = this.productData.product;
  API_URL = environment.API_URL;
  sendOrderSub = Subscription.EMPTY;
  getSupplementsSub = Subscription.EMPTY;
  productsDoesNotPurchased = [
    'ProductsInBasketFromSeveralNetworks',
    'ProductExistsButCannotBePurchased',
    'ProductDoesNotExists',
  ];
  imgEnlarged: boolean = false;
  productQuantity: number = 1;
  supplementsPrice: number = 0;
  supplements: ProductSupplementInterface[] = [];
  needAddNewProductToCart$ = new BehaviorSubject<boolean>(false);

  constructor(
    private selectedProductsService: SelectedProductsService,
    private notifier: NotifierService,
    private translate: TranslateService,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public productData: ProductsData,
  ) {
  }

  ngOnInit(): void {
    this.getProductSupplements();
  }

  ngOnDestroy() {
    this.needAddNewProductToCart$.next(false);
  }

  getSupplementsPrice(event: number): void {
    this.supplementsPrice = event;
  }

  getAllProductPrice(): number {
    return (this.product.price + this.supplementsPrice) * this.productQuantity;
  }

  getProductSupplements() {
    this.getSupplementsSub = this.productsService.getProductSupplements(this.productData.product.id)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => this.supplements = res.supplements,
        () => this.notifier.notify('error', this.translate.instant(marker('Добавки товару не вдалося завантажити'))));
  }

  addProductByInput(product: AddToCartProductInterface, event: any) {
    this.selectedProductsService.addProductToCartByInput(product, event);
  }

  addProduct(product: AddToCartProductInterface) {
    this.selectedProductsService.addProductToCart(product);
  }

  getProductCount(productCartId: number): number {
    return this.selectedProductsService.getProductCount(productCartId);
  }

  deleteProduct(product: AddToCartProductInterface) {
    this.selectedProductsService.removeQuantityProductFromCart(product);
  }

  deleteSelectedProducts() {
    return this.selectedProductsService.deleteSelectedProducts();
  }

  getFullPriceProduct(): number {
    return this.selectedProductsService.getFullPriceProduct(this.product.cartId);
  }

  addProductIfNotExistInCart() {
    this.needAddNewProductToCart$.next(true);
  }

  addProductQuantity() {
    this.productQuantity++;
  }

  addProductQuantityByInput(event: any) {
    const value = +event.target.value.replace(/\D+/g, '');
    if (value && value > 0) {
      this.productQuantity = value;
    } else {
      this.productQuantity = 1;
    }
  }

  removeProductQuantity() {
    if (this.productQuantity > 1) {
      this.productQuantity--;
    }
  }
}
