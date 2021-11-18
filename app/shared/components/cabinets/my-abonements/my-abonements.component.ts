import { Component, OnInit } from '@angular/core';
import { SelectedAbonementsService } from '../../../services/selected-abonements.service';
import { MatDialog } from '@angular/material/dialog';
import { EstablishmentLocationsDialogComponent } from './establishment-locations-dialog/establishment-locations-dialog.component';
import { filter, map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AbonementInterface,
  needUpdateAbonements$,
  RequestBodyAbonementInterface,
} from '../../../helpers/abonements.helper';
import { UserSideNetworkInterface } from '../../../helpers/networks.helper';
import { AbonementsService } from '../../../services/abonements.service';
import { Subscription } from 'rxjs';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { CoffeeShopInterface } from '../../owner-establishment/helpers/network.helper';
import { getLocalizationCityKey } from '../../../translates/cities-translate.helper';
import { NETWORK_ESTABLISHMENTS, ShoppingCartEnum } from '../../../helpers/products.helper';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NotificationType } from '../../../objects/notification/notification.component';
import { AbonementPreviewComponent } from '../../dialogs/abonement-preview/abonement-preview.component';
import { NotifierService } from 'angular-notifier';
import { FriendsService } from '../friends/friends.service';
import { FriendsPageResponseData } from '../friends/friends.helper';
import { EstablishmentLocationPreviewComponent } from '../../dialogs/establishment-location-preview/establishment-location-preview.component';
import { CookieService } from 'ngx-cookie';

@UntilDestroy()
@Component({
  selector: 'my-abonements',
  templateUrl: './my-abonements.component.html',
  styleUrls: ['./my-abonements.component.scss'],
})
export class MyAbonementsComponent implements OnInit {
  friendEmailFromQueryParams = this.route.snapshot.queryParams.email;
  abonements: AbonementInterface[] = [];
  friendsData: FriendsPageResponseData[] = [];
  isProductsListVisible: boolean = false;
  network: UserSideNetworkInterface | null = null;
  establishment$ = this.route.params.pipe(map((params) => params.establishment));
  currentCityNameEn = this.cookie.get('city');
  getAbonementsSub = Subscription.EMPTY;
  NotificationType = NotificationType;
  error: string = '';
  currentEstablishmentSlug: string = '';
  API_URL = environment.API_URL;
  selectedCoffeeShop: CoffeeShopInterface | UserSideNetworkInterface = null;
  networkEstablishmentsConfig: SwiperConfigInterface = NETWORK_ESTABLISHMENTS;
  activeSlide: number = 0;
  readonly cartType = ShoppingCartEnum;
  SITE_URL = environment.SITE_URL;

  constructor(
    private selectedAbonementsService: SelectedAbonementsService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private notifier: NotifierService,
    private title: Title,
    private meta: Meta,
    private cookie: CookieService,
    private abonementsService: AbonementsService,
    private deviceDetectorService: DeviceDetectorService,
    private friendsService: FriendsService,
  ) {
  }

  ngOnInit(): void {
    this.getEstablishment();
    this.setMetaTags();
    if (this.friendEmailFromQueryParams) {
      this.notifyAboutSendGiftToFriend();
    }
    this.getMyFriends();
    needUpdateAbonements$.pipe(
      filter((needUpdate) => !!needUpdate),
      untilDestroyed(this),
    ).subscribe(() => {
      this.getAbonements(this.network.slug);
      needUpdateAbonements$.next(false);
    });
  }

  private getMyFriends() {
    this.friendsService.getFriends()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => this.friendsData = res.friends);
  }

  private notifyAboutSendGiftToFriend() {
    this.notifier.notify('success', this.translate.instant(marker('Виберіть абонементи для подарунку')));
  }

  isTabletsOrMobiles() {
    return this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
  }

  private setMetaTags() {
    this.title.setTitle(`${this.translate.instant(marker('CoffeePhone | Мої Абонементи'))}`);
    this.meta.updateTag({
      property: 'og:site_name',
      content: this.translate.instant(marker(
        'Обери будь який абонемент та створи своє замовлення, після чого покажи QR-код в кав\'ярні')),
    });
  }

  private getEstablishment() {
    this.establishment$.pipe(untilDestroyed(this))
      .subscribe((establishmentSlug) => {
          this.currentEstablishmentSlug = establishmentSlug;
          this.getAbonements(this.currentEstablishmentSlug);
        },
      );
  }

  getAbonements(establishmentSlug: string, addBonusesAfterDeletingAbonements?: boolean) {
    this.error = '';
    this.getAbonementsSub = this.abonementsService.getAbonements(establishmentSlug, addBonusesAfterDeletingAbonements)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
          this.abonements = res.abonements;
          this.network = res.network;
        },
        (res) => {
          this.error = getBackendMessage(res.message);
        },
      );
  }

  addAbonementToCart(abonement: AbonementInterface) {
    this.selectedAbonementsService.addAbonementToCart(abonement.supplements[0], abonement);
  }

  abonementExistInCart(abonementProductId: number): boolean {
    return this.selectedAbonementsService.abonementExistInCart(abonementProductId);
  }

  openPreviewOrAddToCart(abonement: AbonementInterface) {
    abonement.supplements.length > 0 ? this.openAbonementPreview(abonement) : this.addAbonementToCart(abonement);
  }

  deletedAbonements(): AbonementInterface[] {
    let deletedSupplements = [];
    this.abonements.forEach((el) => {
      deletedSupplements = [...el.supplements.filter((s) => !!s.deleted), ...deletedSupplements];
    });
    return deletedSupplements;
  }

  isDeletedAbonement(abonement: AbonementInterface) {
    return abonement.supplements.find((el) => !!el.deleted);
  }

  deletedAbonementsBonuses() {
    return this.deletedAbonements().reduce((a, b) => a + +b.product_price * b.quantity, 0);
  }

  getCoffeeShopsFromCurrentCity(): CoffeeShopInterface[] {
    return this.network.coffee_shops
      .filter((coffeeShop) => this.currentCityNameEn
        ? coffeeShop.region.name_en === this.currentCityNameEn : false)
      .sort((a, b) =>
        this.translate.instant(marker(getLocalizationCityKey(a.region.name_en)))
          .localeCompare(this.translate.instant(marker(getLocalizationCityKey(b.region.name_en)))));
  }

  isNewAbonement(abonement: AbonementInterface): boolean {
    const todayDate = new Date().toDateString();
    const threeDaysInMilliseconds = 259200000;
    return false;
    // return Date.parse(todayDate) - Date.parse(abonement.updated_at) < threeDaysInMilliseconds;
  }

  openLocation() {
    this.dialog.open(EstablishmentLocationsDialogComponent, {data: this.network});
  }

  goBack() {
    this.location.back();
  }

  openCoffeeShopPreview(coffeeShop: CoffeeShopInterface | UserSideNetworkInterface, index: number) {
    this.dialog.open(EstablishmentLocationPreviewComponent,
      {data: {network: this.network, slides: this.getCoffeeShopsFromCurrentCity(), index}});
  }

  closeCoffeeShopPreview() {
    this.selectedCoffeeShop = null;
  }

  openAbonementPreview(abonement: AbonementInterface | RequestBodyAbonementInterface) {
    this.dialog.open(AbonementPreviewComponent, {data: {abonement}});
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
