import { Injectable, Pipe, PipeTransform } from '@angular/core';
import {
  NetworkEstablishmentsRegions,
} from '../components/owner-establishment/helpers/network.helper';
import { getLocalizationCityKey } from '../translates/cities-translate.helper';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@Injectable()
@Pipe({name: 'searchEstablishments'})
export class SearchEstablishmentsPipe implements PipeTransform {
  constructor(private translate: TranslateService) {
  }
  transform(elements: NetworkEstablishmentsRegions[], value: string) {
    return !value ? elements : elements.filter((el: any) =>
      this.translate.instant(marker(getLocalizationCityKey(el.name_en))).toLowerCase().includes(value.toLowerCase()));
  }
}
