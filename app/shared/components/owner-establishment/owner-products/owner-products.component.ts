import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OwnerProductEditingComponent } from './owner-product-editing/owner-product-editing.component';
import { UserLoginQuery } from '../../../../states/user-login/user-login.query';
import { CategoriesInterface, ProductInterface } from '../../../helpers/products.helper';
import { NetworkProductsService } from '../../../services/owner/network-products.service';
import { filter, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { getLocalizationCategoriesKey } from '../helpers/network.helper';
import {
  ConfirmDeleteDialogComponent,
  ConfirmDeleteInterface,
} from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { trimLongText } from 'src/app/shared/helpers/helpers';

@UntilDestroy()
@Component({
  selector: 'owner-products',
  templateUrl: './owner-products.component.html',
  styleUrls: ['./owner-products.component.scss'],
})
export class OwnerProductsComponent implements OnInit {
  products: ProductInterface[] = [];
  productsSub = Subscription.EMPTY;
  categoriesSub = Subscription.EMPTY;
  categoryId: number;
  categories: CategoriesInterface[] = [];
  isOwnerLoggedIn$ = this.userLoginQuery.isOwnerLoggedIn$;
  isOwnerLoggedIn = () => this.userLoginQuery.isOwnerLoggedIn();
  API_URL = environment.API_URL;
  getCategoriesError: string = '';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private notifier: NotifierService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private userLoginQuery: UserLoginQuery,
    private notifierService: NotifierService,
    private networkProductsService: NetworkProductsService,
    private deviceDetectorService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit(): void {
    this.getCategoriesWithProduct();
  }

  trimLongText(txt: string) {
    const maxWordsForDescr = 60;
    return trimLongText(txt, maxWordsForDescr, false);
  }

  openEditProductDialog(product: ProductInterface) {
    if (this.isOwnerLoggedIn()) {
      this.dialog.open(OwnerProductEditingComponent, {data: product})
        .afterClosed()
        .pipe(filter((id) => !!id), take(1), untilDestroyed(this))
        .subscribe((id: number) => this.getCategoriesWithProduct(id));
    }
  }

  openDeleteProductDialog(product: ProductInterface) {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        deleteFunc: () => this.networkProductsService.deleteProduct(product, false),
        element: product,
      } as ConfirmDeleteInterface,
    }).afterClosed()
      .pipe(filter((isHaveChanges) => !!isHaveChanges), take(1), untilDestroyed(this))
      .subscribe(() => {
        const needCategoryId = this.products.length === 1 ? this.categories[0].id : this.categoryId;
        this.getCategoriesWithProduct(needCategoryId);
        // tslint:disable-next-line:max-line-length
        this.notifierService.notify('success', `${this.translate.instant(marker('Товар '))}${product.name}${this.translate.instant(marker(' успішно видалений.'))}`);
      });
  }

  openAddProductDialog() {
    this.dialog.open(AddProductDialogComponent).afterClosed()
      .pipe(filter((id) => !!id), take(1), untilDestroyed(this))
      .subscribe((id: number) => this.getCategoriesWithProduct(id));
  }

  getCategoryName(name: string) {
    return getLocalizationCategoriesKey(name);
  }

  getCategoriesWithProduct(id?: number) {
    this.getCategoriesError = '';
    this.categoriesSub = this.networkProductsService.getCategoriesWithProduct()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((productsData) => {
          this.categories = productsData.categories;
          if (id) {
            this.categoryId = id;
            this.getProductsByCategory(id);
          } else {
            this.products = productsData.products;
            this.categoryId = productsData.categories[0].id;
          }
        },
        (res) => {
          this.getCategoriesError = getBackendMessage(res.message);
        },
      );
  }

  getProductsByCategory(categoryId: number) {
    this.productsSub = this.networkProductsService.getProductsByCategory(categoryId)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
        this.products = res.products;
        this.scrollToCategory(categoryId);
      });
  }

  hideProductToggle(product: ProductInterface) {
    const productHidden: number = product.hide ? 0 : 1;
    this.networkProductsService.hideProductToggle(product.id, productHidden)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
          const textForNotification = !product.hide
            ? ' знято з вітрини.'
            : ' виставлено на вітрину.';
          this.notifier.notify('success', product.name + this.translate.instant(marker(textForNotification)));
          product.hide = productHidden === 1;
          product.inaccessible = false;
        },
        (res) => {
          this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
        });
  }

  productNotAvailableToggle(product: ProductInterface) {
    const productInaccessible = product.inaccessible ? 0 : 1;
    this.networkProductsService.productNotAvailableToggle(product.id, productInaccessible)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => {
          const textForNotification = !product.inaccessible
            ? ' недоступно для купівлі.'
            : ' доступно для купівлі.';
          this.notifier.notify('success', product.name + this.translate.instant(marker(textForNotification)));
          product.inaccessible = productInaccessible === 1;
          product.hide = false;
        },
        (res) => {
          this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
        });
  }

  getCategory() {
    return this.categories.find((category) => category.id === this.categoryId);
  }

  changeCategory(id: number) {
    this.categoryId = id;
    this.getProductsByCategory(id);
  }

  scrollToCategory(id: any) {
    if (isPlatformBrowser(this.platform)) {
      document.getElementById(id)?.scrollIntoView({block: 'center', behavior: 'smooth'});
    }
  }

  isTabletsOrMobiles() {
    return this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
  }
}
