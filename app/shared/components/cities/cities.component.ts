import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '../../../../environments/environment';
import { LocalStorage } from '../../storages/interfaces/local-storage.interface';
import { CitiesService } from '../../services/cities.service';
import {
  AreaInterface,
  RegionsNetworkInterface,
} from '../../helpers/cities.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { getLocalizationCityKey } from '../../translates/cities-translate.helper';
import { LanguageService } from '../../services/language.service';
import { getBackendMessage } from '../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';
import { ProductsService } from '../../services/products.service';
import { UserSideNetworkInterface } from '../../helpers/networks.helper';
import { AuthHeaderService } from '../login/state/auth-header.service';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { HotOrderDialogComponent } from '../dialogs/hot-order-dialog/hot-order-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { searchValue$ } from '../../objects/search-input/search-input.helper';
import { PageMetaService } from '../../seo/graph-cms/page-meta/page-meta.service';
import { SeoPageName } from '../../seo/models/page-name.enum';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Component({
  selector: 'cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CitiesComponent implements OnInit, OnDestroy {
  cities: AreaInterface[];
  API_URL = environment.API_URL;
  isCitiesLoaded: boolean = false;
  searchCityValue$ = searchValue$;
  error: string = '';
  citiesLoadingTimeoutFunc: any;
  establishments: RegionsNetworkInterface[] = [];
  network: UserSideNetworkInterface | null = null;
  currentCity = this.cookie.get('city');
  isLoggedIn$ = this.userLoginQuery.isUserLoggedIn$;
  isLongLoading: boolean = false;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private translate: TranslateService,
    private citiesService: CitiesService,
    private languageService: LanguageService,
    private notifier: NotifierService,
    private authHeaderService: AuthHeaderService,
    private productsService: ProductsService,
    private dialog: MatDialog,
    private userLoginQuery: UserLoginQuery,
    private pageMetaService: PageMetaService,
  ) {
    if (this.currentCity) {
      this.router.navigate([this.currentCity + '/purchase-establishments']).then();
    }
  }

  ngOnInit(): void {
    this.pageMetaService.initTags(SeoPageName.MainPage);
    this.getCities();
  }

  ngOnDestroy() {
    this.notifier.hideAll();
    clearTimeout(this.citiesLoadingTimeoutFunc);
  }

  openFastOrder() {
    this.dialog.open(HotOrderDialogComponent);
  }

  openSmallCities(id: string) {
    this.router.navigate([id + '/cities']).then();
  }

  getCities() {
    const timeoutForShowCitiesLoadingNotify: number = 2000;
    this.languageService.currentLanguage$.pipe(
      tap(() => this.citiesLoadingTimeoutFunc = setTimeout(() => {
        this.isLongLoading = true;
        this.notifier.notify('primary',
          this.translate.instant(marker('Зачекайте, для того щоб скористатися пошуком областей!')), 'citiesLoading');
      }, timeoutForShowCitiesLoadingNotify)),
      switchMap(() => this.citiesService.getCities(true, false)),
      tap(() => {
        this.notifier.hide('citiesLoading');
        clearTimeout(this.citiesLoadingTimeoutFunc);
      }),
      untilDestroyed(this),
    ).subscribe((citiesData) => {
        if (this.isLongLoading) {
          this.notifier.notify('primary', this.translate.instant(marker('Області успішно завантажені.')));
        }
        this.isCitiesLoaded = true;
        this.cities = citiesData.areas;
        this.cities.forEach((area) => {
          area.name = this.translate.instant(getLocalizationCityKey(area.name_en));
        });
      },
      (res) => {
        this.isCitiesLoaded = true;
        this.error = getBackendMessage(res.message);
      },
    );
  }

  scrollToAnchor(element) {
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
}
