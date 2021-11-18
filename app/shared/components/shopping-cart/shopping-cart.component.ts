import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  needUpdateAbonements$,
  RequestBodyAbonementInterface,
} from '../../helpers/abonements.helper';
import {
  AddToCartProductInterface,
  needUpdateProducts$,
  ProductInterface,
  ProductOperationTypeEnum, ProductsTemplate, ShoppingCartEnum,
} from '../../helpers/products.helper';
import { UserSideNetworkInterface } from '../../helpers/networks.helper';
import { Subscription } from 'rxjs';
import { SelectedProductsService } from '../../services/selected-products.service';
import { SelectedAbonementsService } from '../../services/selected-abonements.service';
import { ProductPreviewComponent } from '../dialogs/product-preview/product-preview.component';
import { MatDialog } from '@angular/material/dialog';
import { AbonementPreviewComponent } from '../dialogs/abonement-preview/abonement-preview.component';
import { filter, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { getBackendMessage } from '../../helpers/errors.helper';
import { ProductsService } from '../../services/products.service';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { FriendsPageResponseData } from '../cabinets/friends/friends.helper';
import { AbonementsService } from '../../services/abonements.service';
import { QrcodeAbonementsDialogComponent } from '../cabinets/my-abonements/qrcode-abonements-dialog/qrcode-abonements-dialog.component';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';

@UntilDestroy()
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  @Input() currentCartType: ShoppingCartEnum = ShoppingCartEnum.ProductsTemplate;
  @Input() pageLoaded: boolean = false;
  @Input() isMobile: boolean = false;
  @Input() activeProductsTemplate: ProductsTemplate;
  @Input() network: UserSideNetworkInterface = null;
  @Input() friendsData: FriendsPageResponseData[] = [];
  isLoggedIn: boolean = false;
  productsDoesNotPurchased = [
    'ProductsInBasketFromSeveralNetworks',
    'ProductExistsButCannotBePurchased',
    'ProductDoesNotExists',
  ];
  readonly cartType = ShoppingCartEnum;
  sendOrderSub = Subscription.EMPTY;
  isGiftTemplate: boolean = false;
  friendEmailFromQueryParams = this.route.snapshot.queryParams.email;
  friendEmailForGift = new FormControl('', [Validators.required]);
  isProductsListVisible: boolean = false;
  listPaymentMethodIsVisible = false;

  constructor(
    private selectedProductsService: SelectedProductsService,
    private selectedAbonementsService: SelectedAbonementsService,
    private productsService: ProductsService,
    private notifier: NotifierService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private abonementsService: AbonementsService,
    private userLoginQuery: UserLoginQuery,
  ) {
  }

  ngOnInit(): void {
    this.getLoginState();
    if (this.friendEmailFromQueryParams) {
      this.chooseAbonementsForGift();
    }
  }

  ngOnDestroy() {
    this.deleteSelectedProducts();
  }

  getLoginState() {
    this.userLoginQuery.isUserLoggedIn$
      .pipe(untilDestroyed(this))
      .subscribe((isUserLoggedIn) => {
        this.isLoggedIn = isUserLoggedIn;
      });
  }

  isCanAddAbonement(abonement: any) {
    if (this.currentCartType === this.cartType.MyAbonements) {
      return abonement.quantityForOrder < abonement.supplement.quantity;
    }
    return true;
  }

  getSelectedProductsCount(): number {
    switch (this.currentCartType) {
      case this.cartType.ProductsTemplate:
        return this.selectedProductsService.getSelectedProductsCount();
      case this.cartType.MyAbonements:
        return this.selectedAbonementsService.getSelectedAbonementsCount();
      case this.cartType.AbonementsTemplate:
        return 0;
      default:
        return null;
    }
  }

  geAllProductsCount(): number {
    switch (this.currentCartType) {
      case this.cartType.ProductsTemplate:
        return this.getSelectedProducts().length;
      case this.cartType.MyAbonements:
        return this.getSelectedAbonements().length;
      case this.cartType.AbonementsTemplate:
        return 0;
      default:
        return null;
    }
  }

  deleteSelectedProducts() {
    switch (this.currentCartType) {
      case this.cartType.ProductsTemplate:
        return this.selectedProductsService.deleteSelectedProducts();
      case this.cartType.MyAbonements:
        return this.selectedAbonementsService.clearSelectedAbonements();
      case this.cartType.AbonementsTemplate:
        return 0;
      default:
        return null;
    }
  }

  getSelectedAbonementsCount(): number {
    return this.selectedAbonementsService.getSelectedAbonementsCount();
  }

  getSelectedProducts(): AddToCartProductInterface[] {
    return this.selectedProductsService.getSelectedProducts();
  }

  getSelectedAbonements(): RequestBodyAbonementInterface[] {
    return this.selectedAbonementsService.getSelectedAbonements();
  }

  getActualPrice() {
    return this.selectedProductsService.getOrderActualPrice();
  }

  getBonus() {
    return this.selectedProductsService.getProductBonuses();
  }

  getProductCount(productCartId: number) {
    return this.selectedProductsService.getProductCount(productCartId);
  }

  getFullPriceProduct(productId: number) {
    return this.selectedProductsService.getFullPriceProduct(productId);
  }

  addProduct(product: any) {
    this.selectedProductsService.addProductToCart(product);
  }

  removeQuantityProduct(product: AddToCartProductInterface) {
    this.selectedProductsService.removeQuantityProductFromCart(product);
  }

  deleteProduct(product: AddToCartProductInterface) {
    this.selectedProductsService.deleteProductFromCart(product);
  }

  addAbonementToCart(abonement: RequestBodyAbonementInterface) {
    this.selectedAbonementsService.addAbonementToCart(abonement.supplement, abonement);
  }

  removeQuantitySelectedAbonement(abonement: RequestBodyAbonementInterface) {
    this.selectedAbonementsService.removeQuantitySelectedAbonement(abonement);
  }

  deleteSelectedAbonement(abonement: RequestBodyAbonementInterface) {
    this.selectedAbonementsService.deleteSelectedAbonement(abonement);
  }

  openProductPreview(product: ProductInterface | AddToCartProductInterface) {
    this.dialog.open(ProductPreviewComponent, {data: {product, operationType: ProductOperationTypeEnum.Edit}});
  }

  openAbonementsPreview(abonement: ProductInterface | AddToCartProductInterface) {
    this.dialog.open(AbonementPreviewComponent, {data: {abonement}});
  }

  private chooseAbonementsForGift() {
    this.isGiftTemplate = true;
    this.friendEmailForGift.setValue(this.friendEmailFromQueryParams);
  }

  clearEmailFromQueryParams() {
    if (this.friendEmailFromQueryParams) {
      this.router.navigate([],
        {
          queryParams: {email: null},
          queryParamsHandling: 'merge',
        }).then();
      this.friendEmailFromQueryParams = '';
    }
  }

  generateOrderQrCode() {

  }

  startPayment(useBonuses: boolean) {
    this.sendOrderSub = this.productsService.sendOrder(
      this.selectedProductsService.initSelectedProducts(), useBonuses)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(
        () => this.deleteSelectedProducts(),
        (res) => {
          if (this.productsDoesNotPurchased.find((message) => message === res.message)) {
            needUpdateProducts$.next(true);
            this.deleteSelectedProducts();
            this.notifier.notify('error',
              this.translate.instant(
                marker('Товар(и) недоступні для купівлі. Ми оновили вітрину, складіть замовлення ще раз.')));
          } else {
            this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          }
        },
      );
  }

  startOnlinePayment() {
    this.startPayment(false);
  }

  togglePaymentMethodDialog() {
    this.listPaymentMethodIsVisible = !this.listPaymentMethodIsVisible;
  }

  sengGiftToFriend() {
    if (this.friendEmailForGift.valid) {
      this.sendOrderSub = this.abonementsService.sengGiftToFriend(
        this.selectedAbonementsService.initSelectedAbonements(),
        this.friendEmailForGift.value,
      ).pipe(take(1), untilDestroyed(this))
        .subscribe((res: any) => {
            if (res.message === 'UserDoesNotExists' || res.message === 'YouCannotGiveYourself') {
              this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
            } else if (res.message === 'AbonementDoesNotExist' || res.message === 'QuantityLimitExceeded') {
              this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
              this.deleteSelectedProducts();
              needUpdateAbonements$.next(true);
            } else {
              this.isGiftTemplate = false;
              needUpdateAbonements$.next(true);
              this.deleteSelectedProducts();
              this.clearEmailFromQueryParams();
            }
          },
          (res) => {
            this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          },
        );
    }
  }

  generateMyAbonementsQrCode() {
    this.sendOrderSub =
      this.abonementsService.generateAbonementsQrCode(this.selectedAbonementsService.initSelectedAbonements())
        .pipe(take(1))
        .subscribe((res: any) => {
            if (res.message === 'AbonementDoesNotExist') {
              needUpdateAbonements$.next(true);
              this.deleteSelectedProducts();
            } else {
              this.dialog.open(QrcodeAbonementsDialogComponent, {data: res}).afterClosed()
                .pipe(filter((state) => !!state), take(1), untilDestroyed(this))
                .subscribe(() => needUpdateAbonements$.next(true));
            }
          }, (res) => {
            if (res.message === 'AbonementDoesNotExist' || res.message === 'InsufficientQuantityAbonements') {
              needUpdateAbonements$.next(true);
              this.deleteSelectedProducts();
            }
            this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
          },
        );
  }

  toggleProductsList() {
    this.isProductsListVisible = !this.isProductsListVisible;
  }
}
