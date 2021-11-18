import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AreaInterface,
  EstablishmentsTypeEnum,
  Region,
  RegionWithData,
  RegionWithEstablishments,
} from '../helpers/cities.helper';
import { LocalStorage } from '../storages/interfaces/local-storage.interface';
import { Router } from '@angular/router';
import { NetworkEstablishments } from '../components/owner-establishment/helpers/network.helper';
import { getLocalizationCityKey } from '../translates/cities-translate.helper';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';

@Injectable({providedIn: 'root'})
export class CitiesService {
  currentCity$ = new BehaviorSubject<Region>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    private cookie: CookieService,
  ) {
  }

  getCities(
    isNetworksExist: boolean,
    showRegions: boolean,
    area?: string,
    onlyBonuses?: boolean,
  ): Observable<AreaInterface> {
    const params = { showRegions: showRegions.toString() };
    if (isNetworksExist) {
      params['isNetworks'] = true;
    }
    if (area) {
      params['name_en'] = area;
    }
    if (onlyBonuses) {
      params['onlyBonuses'] = true;
    }
    return this.http.get<AreaInterface>('/api/areas', {params});
  }

  getRegionsWithEstablishments(
    region: string,
    establishmentsType: EstablishmentsTypeEnum,
  ): Observable<RegionWithEstablishments> {
    this.router.navigate([], {queryParams: {establishmentsType}});
    const params = {
      isNetworks: 'true',
      name_en: region,
    };
    if (establishmentsType === EstablishmentsTypeEnum.Bonuses) {
      params['onlyBonuses'] = 'true';
    }
    return this.http.get<RegionWithEstablishments>('/api/regions', {params});
  }

  getRegion(area?: string): Observable<RegionWithData> {
    return this.http.get<RegionWithData>('/api/regions?name_en=' + area);
  }

  setCity(region: Region) {
    this.currentCity$.next(region);
    this.router.navigate(['/']).then(() => {
      this.router.navigate(['/' + region.name_en + '/purchase-establishments']).then();
    });
    const cookieCity = this.cookie.get('city');
    if (!cookieCity || cookieCity !== region.name_en) {
      this.cookie.put('city', region.name_en, {path: '/'});
    }
  }

  filterAreas(establishments: any, filteredArea: any, areaFilterCtrl: any) {
    if (!establishments) {
      return;
    }
    let search = areaFilterCtrl.value;
    const areaGroupsCopy = this.copyArea(establishments);
    if (!search) {
      filteredArea.next(areaGroupsCopy);
      return;
    } else {
      search = search.toLowerCase();
    }
    filteredArea.next(
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

  copyArea(areas: NetworkEstablishments[] | AreaInterface[]) {
    const areaGroupsCopy: any[] = [];
    areas.forEach((area: any) => {
      const localizationRegions = area.regions;
      localizationRegions.forEach((region) => {
        region.name = this.translate.instant(getLocalizationCityKey(region.name_en));
      });
      areaGroupsCopy.push({
        name: this.translate.instant(getLocalizationCityKey(area.name_en)),
        name_en: area.name_en,
        regions: area.regions ? localizationRegions.slice() : localizationRegions,
      });
    });
    return areaGroupsCopy;
  }
}
