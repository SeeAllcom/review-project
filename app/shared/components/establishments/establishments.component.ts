import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { CitiesService } from '../../services/cities.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  EstablishmentsTypeEnum,
  RegionsNetworkInterface, RegionWithData,
} from '../../helpers/cities.helper';
import { Meta, Title } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { getLocalizationCityKey } from '../../translates/cities-translate.helper';
import { getBackendMessage } from '../../helpers/errors.helper';
import { UserHistoryService } from '../dialogs/user-history/user-history.service';
import { RealtimeUpdatesService } from '../../websockets/realtime-updates.service';
import { UserLoginQuery } from '../../../states/user-login/user-login.query';
import { MatDialog } from '@angular/material/dialog';
import { CityDialogComponent } from '../city-dialog/city-dialog.component';
import { searchValue$ } from '../../objects/search-input/search-input.helper';
import { SeoPageName } from '../../seo/models/page-name.enum';
import { PageMetaService } from '../../seo/graph-cms/page-meta/page-meta.service';
import { MIN_BONUSES_PERCENTAGE } from '../../helpers/helpers';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Component({
  selector: 'establishments',
  templateUrl: './establishments.component.html',
  styleUrls: ['./establishments.component.scss'],
})
export class EstablishmentsComponent implements OnInit {
  @ViewChild('all', {static: true}) all: TemplateRef<EstablishmentsComponent>;
  @ViewChild('bonuses', {static: true}) bonuses: TemplateRef<EstablishmentsComponent>;
  @ViewChild('selected', {static: true}) selected: TemplateRef<EstablishmentsComponent>;
  readonly establishmentsType = EstablishmentsTypeEnum;
  establishmentTypesParams: EstablishmentsTypeEnum = this.route.snapshot.queryParams.establishmentsType;
  currentEstablishmentsType: EstablishmentsTypeEnum = this.establishmentTypesParams
    ? this.establishmentTypesParams : EstablishmentsTypeEnum.All;
  isUserLogin$ = this.userLoginQuery.isUserLoggedIn$;
  establishments: RegionsNetworkInterface[] = [];
  networksLoaded: boolean = false;
  spinnerShown: boolean = false;
  city$ = this.route.params.pipe(map((params) => params.city));
  currentCityNameEn: string = '';
  cityNameEn: any = this.cookie.get('city');
  currentCity$ = this.citiesService.currentCity$;
  API_URL = environment.API_URL;
  notFoundRegion: string = '';
  serverError: string = '';
  isUserLogin: boolean;
  searchEstablishmentValue$ = searchValue$;
  minBonusesPercentage = MIN_BONUSES_PERCENTAGE;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private citiesService: CitiesService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private title: Title,
    private meta: Meta,
    private userHistoryService: UserHistoryService,
    private realtimeUpdatesService: RealtimeUpdatesService,
    private userLoginQuery: UserLoginQuery,
    private pageMetaService: PageMetaService,
  ) {
  }

  ngOnInit(): void {
    this.getCoffeeNetworks(this.currentEstablishmentsType);
    this.pageMetaService.initTags(SeoPageName.Establishments);
  }

  setMetaTags(city: string) {
    const title =
      this.translate.instant(marker('Виберіть заклад в місті '))
      + this.translate.instant(getLocalizationCityKey(city)) +
      this.translate.instant(marker(' щоб придбати абонементи | CoffeePhone'));
    this.title.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
  }

  getCoffeeNetworks(currentEstablishmentsType: EstablishmentsTypeEnum) {
    this.spinnerShown = true;
    combineLatest([this.city$, this.isUserLogin$]).pipe(
      switchMap(([city, isUserLogin]) => {
        this.isUserLogin = isUserLogin;
        this.currentCityNameEn = city;
        this.currentEstablishmentsType = isUserLogin ? currentEstablishmentsType : EstablishmentsTypeEnum.All;
        return this.citiesService.getRegionsWithEstablishments(city, this.currentEstablishmentsType);
      }),
      untilDestroyed(this),
    ).subscribe((region) => {
        this.spinnerShown = false;
        this.networksLoaded = true;
        if (region.message === 'NoRegion') {
          this.notFoundRegion = getBackendMessage(region.message);
          return;
        }
        this.setMetaTags(region.data.name_en);
        this.setCity(region);
        this.establishments = region.data.networks;
      },
      (res) => {
        this.spinnerShown = false;
        this.serverError = getBackendMessage(res.message);
      },
    );
  }

  setCity(city: RegionWithData) {
    this.currentCity$.next(city.data);
    const cookieCity = this.cookie.get('city');
    if (!cookieCity || cookieCity !== city.data.name_en) {
      this.cookie.put('city', city.data.name_en, {path: '/'});
    }
  }

  openEstablishment(slug: string) {
    this.router.navigate(['/establishment/' + slug]).then();
  }

  openCitiesDialog() {
    this.dialog.open(CityDialogComponent);
  }
}
