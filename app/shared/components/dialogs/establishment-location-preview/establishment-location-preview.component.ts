import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CoffeeShopInterface } from '../../owner-establishment/helpers/network.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { getLocalizationCityKey } from '../../../translates/cities-translate.helper';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { UserSideNetworkInterface } from '../../../helpers/networks.helper';
import { isPlatformBrowser } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isNumber } from '../../../helpers/helpers';

interface LocationPreviewDataInterface {
  network: UserSideNetworkInterface;
  slides: CoffeeShopInterface[];
  index: number;
}

@Component({
  selector: 'establishment-location-preview',
  templateUrl: './establishment-location-preview.component.html',
  styleUrls: ['./establishment-location-preview.component.scss'],
})
export class EstablishmentLocationPreviewComponent implements OnInit {
  activeSlide: CoffeeShopInterface | UserSideNetworkInterface = this.data.slides[this.data.index];
  imgEnlarged: boolean = false;
  API_URL = environment.API_URL;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platform: any,
    @Inject(MAT_DIALOG_DATA) public data: LocationPreviewDataInterface,
  ) {
  }

  ngOnInit(): void {
    if (this.data.network) {
      this.activeSlide = this.data.index === -1 ? this.data.network : this.data.slides[this.data.index];
    }
  }

  prevSlide() {
    this.data.index--;
    this.activeSlide = this.data.index === -1 ? this.data.network : this.data.slides[this.data.index];
  }

  nextSlide() {
    this.data.index++;
    this.activeSlide = this.data.slides[this.data.index];
  }

  getCoffeeShopImage(selectedCoffeeShop: any) {
    return this.API_URL + (selectedCoffeeShop.img ? selectedCoffeeShop.img : selectedCoffeeShop.avatar);
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
