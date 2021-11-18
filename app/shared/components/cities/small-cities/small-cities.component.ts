import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { LocalStorage } from '../../../storages/interfaces/local-storage.interface';
import { AreaInterface, Region } from '../../../helpers/cities.helper';
import { CitiesService } from '../../../services/cities.service';
import { environment } from '../../../../../environments/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Meta, Title } from '@angular/platform-browser';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { getLocalizationCityKey } from '../../../translates/cities-translate.helper';
import { LanguageService } from '../../../services/language.service';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';
import { searchValue$ } from '../../../objects/search-input/search-input.helper';
import { SeoPageName } from '../../../seo/models/page-name.enum';
import { PageMetaService } from '../../../seo/graph-cms/page-meta/page-meta.service';
import { API_URL } from '../../../helpers/urls.helper';

@UntilDestroy()
@Component({
  selector: 'small-cities',
  templateUrl: './small-cities.component.html',
  styleUrls: ['../cities.component.scss'],
})
export class SmallCitiesComponent implements OnInit, OnDestroy {
  city$ = this.route.params.pipe(map((params) => params.city));
  regionsLoaded: boolean = false;
  area: AreaInterface = null;
  API_URL = environment.API_URL;
  searchCityValue$ = searchValue$;
  error: string = '';
  citiesLoadingTimeoutFunc: any;
  isLongLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private title: Title,
    private meta: Meta,
    private notifier: NotifierService,
    private customLocaleStorage: LocalStorage,
    private citiesService: CitiesService,
    private location: Location,
    private languageService: LanguageService,
    private pageMetaService: PageMetaService,
  ) {
  }

  ngOnInit(): void {
    this.pageMetaService.initTags(SeoPageName.SmallCities);
    this.getCityName();
  }

  ngOnDestroy() {
    this.notifier.hideAll();
    clearTimeout(this.citiesLoadingTimeoutFunc);
  }

  setMetaTags(area: AreaInterface) {
    const title = this.translate.instant(area.name)
      + ': ' +
      this.translate.instant(marker('Виберіть ваше місто, щоб придбати абонементи | CoffeePhone'));
    this.title.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:image', content: this.API_URL + area.img});
  }

  getRegions(currentCity: string) {
    const timeoutForShowCitiesLoadingNotify: number = 2000;
    this.languageService.currentLanguage$.pipe(
      tap(() => this.citiesLoadingTimeoutFunc = setTimeout(() => {
        this.isLongLoading = true;
        this.notifier.notify('primary',
          this.translate.instant(marker('Зачекайте, для того щоб скористатися пошуком міст!')), 'citiesLoading');
      }, timeoutForShowCitiesLoadingNotify)),
      switchMap(() => this.citiesService.getCities(true, true, currentCity)),
      tap(() => {
        this.notifier.hide('citiesLoading');
        clearTimeout(this.citiesLoadingTimeoutFunc);
      }),
      untilDestroyed(this),
    ).subscribe((area) => {
        if (this.isLongLoading) {
          this.notifier.notify('primary', this.translate.instant(marker('Міста успішно завантажені.')));
        }
        this.setMetaTags(area.data);
        this.regionsLoaded = true;
        this.area = area.data;
        this.area.regions.forEach((region) => {
          region.name = this.translate.instant(getLocalizationCityKey(region.name_en));
        });
      },
      (res) => {
        this.regionsLoaded = true;
        this.error = getBackendMessage(res.message);
      },
    );
  }

  getCityName() {
    this.city$.pipe(take(1), untilDestroyed(this)).subscribe((area) => this.getRegions(area));
  }

  openCityEstablishments(region: Region) {
    this.citiesService.setCity(region);
  }

  goBack() {
    this.location.back();
  }
}
