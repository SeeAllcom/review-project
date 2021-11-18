import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { SelectedProductsService } from '../../services/selected-products.service';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AddToCartProductInterface,
  CategoriesInterface,
  needUpdateProducts$,
  NETWORK_ESTABLISHMENTS,
  ProductInterface,
  ProductOperationTypeEnum,
  ProductsTemplate, ShoppingCartEnum,
} from '../../helpers/products.helper';
import { ProductsService } from '../../services/products.service';
import { UserSideNetworkInterface } from '../../helpers/networks.helper';
import { environment } from '../../../../environments/environment';
import { combineLatest, Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { EstablishmentLocationsDialogComponent } from '../cabinets/my-abonements/establishment-locations-dialog/establishment-locations-dialog.component';
import { CoffeeShopInterface, getLocalizationCategoriesKey } from '../owner-establishment/helpers/network.helper';
import { DeviceDetectorService } from 'ngx-device-detector';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { getBackendMessage } from '../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { getLocalizationCityKey } from '../../translates/cities-translate.helper';
import { ProductPreviewComponent } from '../dialogs/product-preview/product-preview.component';
import { EstablishmentLocationPreviewComponent } from '../dialogs/establishment-location-preview/establishment-location-preview.component';
import { CookieService } from 'ngx-cookie';
import { NetworkAbonementResponse } from '../owner-establishment/helpers/network-abonements.helper';
import { trimLongText } from '../../helpers/helpers';

@UntilDestroy()
@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit {
  @ViewChild('ProductsTemplate', {static: true}) readonly ProductsTemplate: TemplateRef<ProductsComponent>;
  @ViewChild('AbonementsTemplate', {static: true}) readonly AbonementsTemplate: TemplateRef<ProductsComponent>;
  @ViewChild('NetworkLoading', {static: true}) readonly NetworkLoading: TemplateRef<ProductsComponent>;
  menuTypeParams: ProductsTemplate = this.route.snapshot.queryParams.menuType;
  readonly cartType = ShoppingCartEnum;
  readonly menuState = ProductsTemplate;
  activeMenuTemplate: ProductsTemplate = ProductsTemplate.NetworkLoading;
  coffeeNetworkSlug$ = this.route.params.pipe(map((params) => params.establishment));
  getError: string = '';
  networkSlug: string = '';
  network: UserSideNetworkInterface | null = null;
  categories: CategoriesInterface[] = [];
  products: ProductInterface[] = [];
  abonements: NetworkAbonementResponse[] = [];
  API_URL = environment.API_URL;
  SITE_URL = environment.SITE_URL;
  isLoggedIn: boolean = false;
  networkLoaded: boolean = false;
  categoriesSub = Subscription.EMPTY;
  currentCityNameEn = this.cookie.get('city');
  currentCategoryId: number = null;
  networkEstablishmentsConfig: SwiperConfigInterface = NETWORK_ESTABLISHMENTS;
  fromEstablishmentParams = this.route.snapshot.queryParams.fromEstablishment;
  today = new Date();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private location: Location,
    private cookie: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private userLoginQuery: UserLoginQuery,
    private dialog: MatDialog,
    private selectedProductsService: SelectedProductsService,
    private productsService: ProductsService,
    private title: Title,
    private translate: TranslateService,
    private meta: Meta,
    private notifier: NotifierService,
    private deviceDetectorService: DeviceDetectorService,
  ) {
  }

  ngOnInit(): void {
    this.getNetworkInfo();
    this.getAllMenu();
    needUpdateProducts$.pipe(
      filter((needUpdate) => !!needUpdate),
      untilDestroyed(this),
    ).subscribe(() => this.getCategoriesWithProducts(this.currentCategoryId));
  }

  getPercentageDiscountOrPrice(oldPrice: number, priceWithSale: number) {
    const oneHundred = 100;
    const translatedCurrency = this.translate.instant(marker('грн'));
    return oldPrice > priceWithSale && priceWithSale !== 0
      ? `-${Math.round(( oldPrice / priceWithSale - 1) * oneHundred)}%`
      : priceWithSale.toString() + translatedCurrency;
  }

  trimLongText(txt: string) {
    const maxWordsForDescr = 60;
    return trimLongText(txt, maxWordsForDescr, false);
  }

  getAllMenu() {
    if (this.networkSlug) {
      this.getCategoriesWithProducts();
      this.getAbonements();
    }
  }

  getLocalizationCategoriesKey(name: any) {
    return getLocalizationCategoriesKey(name);
  }

  changeProductsTemplate(template: ProductsTemplate) {
    this.router.navigate([], {queryParams: {menuType: template}});
    this.activeMenuTemplate = template;
  }

  getNetworkInfo() {
    combineLatest([this.coffeeNetworkSlug$, this.userLoginQuery.isUserLoggedIn$]).pipe(
      switchMap(([coffeeNetworkSlug, isUserLogin]) => {
        this.isLoggedIn = isUserLogin;
        this.networkSlug = coffeeNetworkSlug;
        return this.productsService.getUserSideNetworkInfo(coffeeNetworkSlug);
      }),
      untilDestroyed(this),
    ).subscribe((network) => {
        this.networkLoaded = true;
        this.setMetaTags(network.data);
        this.network = network.data;
      }, (res) => {
        this.getError = getBackendMessage(res.message);
      },
    );
  }

  productChangesLabel(product: ProductInterface): string {
    const todayDate = new Date().getTime();
    const threeDaysInMilliseconds = 259200000;
    const isNewProduct = todayDate - Date.parse(product.created_at) < threeDaysInMilliseconds;
    const isUpdatedProduct = todayDate - Date.parse(product.updated_at) < threeDaysInMilliseconds;
    return isUpdatedProduct && isNewProduct
      ? isNewProduct ? marker('Новий') : ''
      : isUpdatedProduct ? marker('Оновлений') : '';
  }

  setMetaTags(network: UserSideNetworkInterface) {
    this.title.setTitle(
      `${this.translate.instant(marker('Купуй каву дешевше та зручніше в '))}
           ${network.name} ${this.translate.instant(marker('за допомогою CoffeePhone'))}`,
    );
    this.meta.updateTag({
      property: 'og:site_name',
      content: this.translate.instant(marker('Абонемент на каву в ')) + network.name,
    });
    this.meta.updateTag({
      property: 'og:title',
      content: this.translate.instant(marker('Купуй абонемент на каву дешевше, даруй абонементи друзям,' +
        ' прокладай маршрут до закладу за допомогою карти.')),
    });
    this.meta.updateTag({
      property: 'og:image',
      content: this.API_URL + network.avatar,
    });
    if (network.description) {
      this.meta.updateTag({property: 'og:description', content: network.name + ' | ' + network.description});
      this.meta.updateTag({name: 'description', content: network.name + ' | ' + network.description});
    }
  }

  getCoffeeShopsFromCurrentCity(): CoffeeShopInterface[] {
    if (this.network && this.network.coffee_shops && this.currentCityNameEn) {
      return this.network.coffee_shops
        .filter((coffeeShop) => coffeeShop.region.name_en === this.currentCityNameEn)
        .sort((a, b) =>
          this.translate.instant(marker(getLocalizationCityKey(a.region.name_en)))
            .localeCompare(this.translate.instant(marker(getLocalizationCityKey(b.region.name_en)))));
    } else {
      return [];
    }
  }

  getAbonements() {
    this.productsService.getAbonements(this.networkSlug)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((abonements) => this.abonements = abonements);
  }

  getCategoriesWithProducts(categoryId?: number) {
    this.categoriesSub = this.productsService.getCategoriesWithProducts(this.networkSlug, categoryId)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
        needUpdateProducts$.next(false);
        if (!categoryId) {
          this.categories = res.categories;
          this.currentCategoryId = res.categories.length ? res.categories[0].id : null;
        }
        this.products = res.products;
        this.changeProductsTemplate(this.menuTypeParams ? this.menuTypeParams : ProductsTemplate.ProductsTemplate);
      }, (res) => this.getError = getBackendMessage(res.message));
  }

  isActiveCategory(categoryId: number) {
    return categoryId === this.currentCategoryId;
  }

  changeCategory(categoryId: number) {
    this.getCategoriesWithProducts(categoryId);
    this.currentCategoryId = categoryId;
  }

  goBack() {
    const url = this.currentCityNameEn + '/purchase-establishments';
    this.router.navigate([url], {queryParams: {establishmentsType: 'all'}});
  }

  isTabletsOrMobiles() {
    return this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
  }

  openLocation() {
    this.dialog.open(EstablishmentLocationsDialogComponent, {data: this.network});
  }

  openCoffeeShopPreview(coffeeShop: CoffeeShopInterface | UserSideNetworkInterface, index: number) {
    this.dialog.open(EstablishmentLocationPreviewComponent,
      {data: {network: this.network, slides: this.getCoffeeShopsFromCurrentCity(), index}});
  }

  openProductPreview(product: ProductInterface | AddToCartProductInterface) {
    this.dialog.open(ProductPreviewComponent, {data: {product, operationType: ProductOperationTypeEnum.Add}});
  }

  copyEstablishmentLink() {
    this.notifier.notify('primary',
      this.translate.instant(
        marker('Посилання на ') +
        this.network.name +
        marker(' успішно скопійовано. Можете поділитися ним з друзями.')));
  }

  shopLinkForShare() {
    // tslint:disable-next-line:max-line-length
    return `${this.translate.instant(marker('Привіт, переходь за посиланням, щоб спробувати смачну каву в'))} ${this.network.name}. ${this.translate.instant(marker('Замовляй абонементи зручно та швидко на CoffeePhone і отримуй кешбек |'))} ${this.SITE_URL}/establishment/${this.network.slug}?fromEstablishment=true`;
  }
}
