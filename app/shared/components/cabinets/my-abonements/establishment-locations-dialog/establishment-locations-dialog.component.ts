import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserSideNetworkInterface } from '../../../../helpers/networks.helper';
import { CitiesService } from '../../../../services/cities.service';
import { getLocalizationCityKey } from '../../../../translates/cities-translate.helper';
import { UntilDestroy } from '@ngneat/until-destroy';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { CoffeeShopInterface } from '../../../owner-establishment/helpers/network.helper';
import { isPlatformBrowser } from '@angular/common';
import { EstablishmentLocationPreviewComponent } from '../../../dialogs/establishment-location-preview/establishment-location-preview.component';
import { CookieService } from 'ngx-cookie';
import { isNumber } from '../../../../helpers/helpers';

@UntilDestroy()
@Component({
  selector: 'establishment-locations-dialog',
  templateUrl: './establishment-locations-dialog.component.html',
  styleUrls: ['./establishment-locations-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EstablishmentLocationsDialogComponent implements OnInit {
  establishment = this.network.name;
  coffeeShopsAddress = this.network?.coffee_shops?.map((shop) => shop.address);
  currentCityNameEn = this.cookie.get('city');
  selectedCoffeeShop: CoffeeShopInterface = null;
  API_URL = environment.API_URL;
  activeSlide: number = 0;
  isShowCurrentCityShops: boolean;

  constructor(
    private citiesService: CitiesService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platform: any,
    @Inject(MAT_DIALOG_DATA) public network: UserSideNetworkInterface,
  ) {
  }

  ngOnInit(): void {
  }

  getCitiesCoffeeShops(currentCity: boolean = true) {
    let result: CoffeeShopInterface[] = this.network.coffee_shops;
    if (this.currentCityNameEn) {
      result = this.network.coffee_shops.filter((coffeeShop) =>
        currentCity
          ? coffeeShop.region.name_en === this.currentCityNameEn
          : coffeeShop.region.name_en !== this.currentCityNameEn);
    }
    return result.sort((a, b) =>
      this.translate.instant(marker(getLocalizationCityKey(a.region.name_en)))
        .localeCompare(this.translate.instant(marker(getLocalizationCityKey(b.region.name_en)))));
  }

  openCoffeeShopPreview(coffeeShop: CoffeeShopInterface, index: number, isShowCurrentCityShops: boolean) {
    this.dialog.open(EstablishmentLocationPreviewComponent,
      {data: {slides: this.getCitiesCoffeeShops(isShowCurrentCityShops), index}});
  }

  openGoogleMaps(coffeeShop: CoffeeShopInterface) {
    if (coffeeShop && isPlatformBrowser(this.platform)) {
      let region = this.translate.instant(marker(getLocalizationCityKey(coffeeShop.region.name_en)));
      if (isNumber(coffeeShop.address)) {
        region = '';
      }
      // tslint:disable-next-line:max-line-length
      window.open(`https://www.google.com/maps/place/${coffeeShop.address.replace(/\s+/g, '+')}${region ? ',+' + region : ''}`, '_blank');
    }
  }
}
