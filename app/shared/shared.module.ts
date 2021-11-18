import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './navigation/header/header.component';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './components/login/auth.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CitiesComponent } from './components/cities/cities.component';
import { EstablishmentsComponent } from './components/establishments/establishments.component';
import { CityDialogComponent } from './components/city-dialog/city-dialog.component';
import { ProductsComponent } from './components/products/products.component';
import { MatMenuModule } from '@angular/material/menu';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MenuDropdownComponent } from './navigation/menu-dropdown/menu-dropdown.component';
import { AddVisitedClassDirective } from './directives/add-visited-class.directive';
import { MatSelectModule } from '@angular/material/select';
import { EstablishmentLocationsDialogComponent } from './components/cabinets/my-abonements/establishment-locations-dialog/establishment-locations-dialog.component';
import { ObjectsModule } from './objects/objects.module';
import { LocatorComponent } from './components/locator/locator.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SmallCitiesComponent } from './components/cities/small-cities/small-cities.component';
import { SearchPipe } from './pipes/search.pipe';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ConfirmedEmailComponent } from './components/login/confirmed-email/confirmed-email.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ConfirmationRegistrationEstablishmentComponent } from './components/login/confirmation-registration-establishment/confirmation-registration-establishment.component';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { SearchEstablishmentsPipe } from './pipes/search-establishments.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageDialogComponent } from './components/language-dialog/language-dialog.component';
import { QrcodeAbonementsDialogComponent } from './components/cabinets/my-abonements/qrcode-abonements-dialog/qrcode-abonements-dialog.component';
import { UserHistoryComponent } from './components/dialogs/user-history/user-history.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { PurchasedAbonementsComponent } from './components/dialogs/user-history/purchased-abonements/purchased-abonements.component';
import { WriteoffAbonementsComponent } from './components/dialogs/user-history/writeoff-abonements/writeoff-abonements.component';
import { UserLoginComponent } from './components/login/user-login/user-login.component';
import { UserRegisterComponent } from './components/login/user-register/user-register.component';
import { PasswordRecoveryComponent } from './components/login/password-recovery/password-recovery.component';
import { MobileMenuComponent } from './navigation/mobile-menu/mobile-menu.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppUpdatingDialogComponent } from './components/dialogs/app-updating-dialog/app-updating-dialog.component';
import { AppFooterComponent } from './navigation/app-footer/app-footer.component';
import { CookieBannerComponent } from './components/dialogs/cookie-banner/cookie-banner.component';
import { PwaBannerComponent } from './components/dialogs/pwa-banner/pwa-banner.component';
import { PresentsAbonementsComponent } from './components/dialogs/user-history/presents-abonements/presents-abonements.component';
import { HotOrderDialogComponent } from './components/dialogs/hot-order-dialog/hot-order-dialog.component';
import { HotOrderComponent } from './components/hot-order/hot-order.component';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMaskModule } from 'ngx-mask';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { TranslateCityPipe } from './pipes/translate-city.pipe';
import { AddPriorityImageBgColorDirective } from './directives/add-priority-image-bg-color.directive';
import { ConfirmWebPushNotificationComponent } from './components/confirm-web-push-notification/confirm-web-push-notification.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { UserQrcodeScannerComponent } from './components/dialogs/user-qrcode-scanner/user-qrcode-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MatButtonModule } from '@angular/material/button';
import { MobileSidebarComponent } from './navigation/mobile-sidebar/mobile-sidebar.component';
import { NetworkInfoComponent } from './components/products/network-info/network-info.component';
import { EstablishmentLocationPreviewComponent } from './components/dialogs/establishment-location-preview/establishment-location-preview.component';
import { AddFriendDialogComponent } from './components/dialogs/add-friend-dialog/add-friend-dialog.component';
import { ProductPreviewComponent } from './components/dialogs/product-preview/product-preview.component';
import { BonusesComponent } from './components/products/bonuses/bonuses.component';
import { GetBackendMessagePipe } from './pipes/get-backend-message.pipe';
import { ProductSupplementsComponent } from './components/dialogs/product-preview/product-supplements/product-supplements.component';
import { AbonementPreviewComponent } from './components/dialogs/abonement-preview/abonement-preview.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { AbonementSupplementsComponent } from './components/dialogs/abonement-preview/abonement-supplements/abonement-supplements.component';
import { HistoryRowInfoComponent } from './components/dialogs/history-row-info/history-row-info.component';
import { ProductSupplementsAddComponent } from './components/dialogs/product-preview/product-supplements-add/product-supplements-add.component';
import { ChoosePaymentComponent } from './components/shopping-cart/choose-payment/choose-payment.component';

const SHARED_INSTANCES = [
  AddVisitedClassDirective,
  OnlyNumbersDirective,
  HeaderComponent,
  SearchPipe,
  GetBackendMessagePipe,
  SearchEstablishmentsPipe,
  TranslateCityPipe,
  ClickOutsideDirective,
  AddPriorityImageBgColorDirective,
  MobileMenuComponent,
  AppFooterComponent,
  CookieBannerComponent,
  PwaBannerComponent,
  ConfirmWebPushNotificationComponent,
  MobileSidebarComponent,
  NetworkInfoComponent,
  EstablishmentLocationPreviewComponent,
];

@NgModule({
  declarations: [
    ...SHARED_INSTANCES,
    AuthComponent,
    CitiesComponent,
    SmallCitiesComponent,
    EstablishmentsComponent,
    CityDialogComponent,
    ProductsComponent,
    MenuDropdownComponent,
    EstablishmentLocationsDialogComponent,
    LocatorComponent,
    ConfirmedEmailComponent,
    NotFoundComponent,
    ConfirmationRegistrationEstablishmentComponent,
    SearchEstablishmentsPipe,
    LanguageDialogComponent,
    QrcodeAbonementsDialogComponent,
    UserHistoryComponent,
    PurchasedAbonementsComponent,
    WriteoffAbonementsComponent,
    UserLoginComponent,
    UserRegisterComponent,
    PasswordRecoveryComponent,
    MobileMenuComponent,
    AppUpdatingDialogComponent,
    AppFooterComponent,
    CookieBannerComponent,
    PwaBannerComponent,
    PresentsAbonementsComponent,
    HotOrderDialogComponent,
    HotOrderComponent,
    ConfirmWebPushNotificationComponent,
    UserQrcodeScannerComponent,
    MobileSidebarComponent,
    NetworkInfoComponent,
    EstablishmentLocationPreviewComponent,
    AddFriendDialogComponent,
    ProductPreviewComponent,
    BonusesComponent,
    ProductSupplementsComponent,
    AbonementPreviewComponent,
    ShoppingCartComponent,
    AbonementSupplementsComponent,
    HistoryRowInfoComponent,
    ProductSupplementsAddComponent,
    ChoosePaymentComponent,
  ],
  exports: [
    ...SHARED_INSTANCES,
    ShoppingCartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    LazyLoadImageModule,
    MatMenuModule,
    MatOptionModule,
    FormsModule,
    MatSelectModule,
    ObjectsModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    MatCheckboxModule,
    TranslateModule,
    NgbPaginationModule,
    GoogleMapsModule,
    ClipboardModule,
    NgxMaskModule.forRoot(),
    SwiperModule,
    ZXingScannerModule,
    MatButtonModule,
  ],
})
export class SharedModule {
}
