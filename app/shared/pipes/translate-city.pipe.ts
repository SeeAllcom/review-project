import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { getLocalizationCityKey } from '../translates/cities-translate.helper';

@Injectable()
@Pipe({name: 'getLocalizationCityKey'})
export class TranslateCityPipe implements PipeTransform {
  transform(value: any, ...args): any {
    return getLocalizationCityKey(value);
  }
}
