import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { AreaInterface, EstablishmentsTypeEnum, Region, RegionsNetworkInterface } from '../../helpers/cities.helper';
import {
  AddToCartProductInterface,
  CategoriesInterface,
  ProductInterface,
  ProductOperationTypeEnum, ShoppingCartEnum,
} from '../../helpers/products.helper';
import { switchMap, take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../helpers/errors.helper';
import { MatDialog } from '@angular/material/dialog';
import { UserSideNetworkInterface } from '../../helpers/networks.helper';
import { CitiesService } from '../../services/cities.service';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../services/products.service';
import { AuthHeaderService } from '../login/state/auth-header.service';
import { environment } from '../../../../environments/environment';
import { LanguageService } from '../../services/language.service';
import { getLocalizationCategoriesKey } from '../owner-establishment/helpers/network.helper';
import { NotifierService } from 'angular-notifier';
import { SelectedProductsService } from '../../services/selected-products.service';
import { ProductPreviewComponent } from '../dialogs/product-preview/product-preview.component';

@UntilDestroy()
@Component({
  selector: 'hot-order',
  templateUrl: './hot-order.component.html',
  styleUrls: ['./hot-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HotOrderComponent implements OnInit, OnDestroy {
  isCitiesLoaded: boolean = false;
  API_URL = environment.API_URL;
  areasWithRegions: AreaInterface[] = [];
  establishments: RegionsNetworkInterface[] = [];
  network: UserSideNetworkInterface | null = null;
  shopsFilter: FormControl = new FormControl();
  areaFilterCtrl: FormControl = new FormControl();
  filteredArea: ReplaySubject<AreaInterface[]> = new ReplaySubject<AreaInterface[]>(1);
  categories: CategoriesInterface[] = [];
  establishmentProducts: ProductInterface[] = [];
  currentCategoryId: number = 0;
  getError: string = '';
  getCategoriesWithProductsError: string = '';
  error: string = '';
  networksSub = Subscription.EMPTY;
  categoriesWithProductsSub = Subscription.EMPTY;
  orderForm: FormGroup = this.formBuilder.group({
    city: new FormControl('', [Validators.required]),
    establishment: new FormControl('', [Validators.required]),
  });
  readonly cartType = ShoppingCartEnum;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private citiesService: CitiesService,
    private translate: TranslateService,
    private notifier: NotifierService,
    private productsService: ProductsService,
    private authHeaderService: AuthHeaderService,
    private languageService: LanguageService,
    private selectedProductsService: SelectedProductsService,
  ) {
  }

  ngOnInit(): void {
    this.selectedProductsService.deleteSelectedProducts();
    this.getCities();
  }

  ngOnDestroy(): void {
    this.selectedProductsService.deleteSelectedProducts();
  }

  getCities() {
    this.languageService.currentLanguage$.pipe(
      switchMap(() => this.citiesService.getCities(true, true)),
      untilDestroyed(this),
    ).subscribe((citiesData) => {
        this.isCitiesLoaded = true;
        this.areasWithRegions = citiesData.areas;
        this.filteredArea.next(this.citiesService.copyArea(this.areasWithRegions));
        this.areaFilterCtrl.valueChanges
          .pipe(untilDestroyed(this))
          .subscribe(() => {
            this.filterAreas();
          });
      },
      (res) => {
        this.isCitiesLoaded = true;
        this.error = getBackendMessage(res.message);
      },
    );
  }

  getEstablishments(currentCity: string) {
    this.orderForm.controls['city'].setValue(currentCity);
    this.networksSub = this.citiesService.getRegionsWithEstablishments(currentCity, EstablishmentsTypeEnum.All)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((region) => {
        this.establishments = region.data.networks;
      });
  }

  getLocalizationCategoriesKey(name: string) {
    return getLocalizationCategoriesKey(name);
  }

  getCategoriesWithProducts(coffeeNetwork: string, clearShoppingCart: boolean, categoryId?: number) {
    this.categoriesWithProductsSub = this.productsService.getCategoriesWithProducts(coffeeNetwork, categoryId)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
          if (!categoryId) {
            this.categories = res.categories;
            this.currentCategoryId = res.categories[0].id;
          }
          if (clearShoppingCart) {
            this.selectedProductsService.deleteSelectedProducts();
            this.getUserSideNetworkInfo();
          }
          this.establishmentProducts = res.products;
        },
        (res) => this.getCategoriesWithProductsError = getBackendMessage(res.message));
  }

  getUserSideNetworkInfo() {
    this.productsService.getUserSideNetworkInfo(this.orderForm.controls['establishment'].value)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((network) => {
        this.network = network.data;
        this.getCategoriesWithProducts(this.network.slug, false);
      });
  }

  changeCategory(categoryId: number) {
    if (this.establishments) {
      this.getCategoriesWithProducts(this.orderForm.controls['establishment'].value, false, categoryId);
      this.currentCategoryId = categoryId;
    }
  }

  filterAreas() {
    if (!this.areasWithRegions) {
      return;
    }
    let search = this.areaFilterCtrl.value;
    const areaGroupsCopy = this.citiesService.copyArea(this.areasWithRegions);
    if (!search) {
      this.filteredArea.next(areaGroupsCopy);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredArea.next(
      areaGroupsCopy.filter((areaGroup) => {
        const showAreaGroup = areaGroup.name.toLowerCase().indexOf(search) > -1;
        if (!showAreaGroup) {
          areaGroup.regions = areaGroup.regions.filter(
            (region: Region) => region.name.toLowerCase().indexOf(search) > -1);
        }
        return areaGroup.regions.length > 0;
      }),
    );
  }

  getSelectedProducts(): AddToCartProductInterface[] {
    return this.selectedProductsService.getSelectedProducts();
  }

  getSelectedProductsCount(): number {
    return this.selectedProductsService.getSelectedProductsCount();
  }

  openProductPreview(product: ProductInterface | AddToCartProductInterface) {
    this.dialog.open(ProductPreviewComponent, {data: {product, operationType: ProductOperationTypeEnum.Add}});
  }
}
