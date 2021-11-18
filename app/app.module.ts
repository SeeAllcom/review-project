import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { appRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiUrlInterceptor } from './shared/interceptors/base-url.interceptor';
import { environment } from '../environments/environment';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import {
  HTTP_INTERCEPTORS,
  HttpBackend,
  HttpClient,
  HttpClientModule,
  HttpXhrBackend,
} from '@angular/common/http';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { StorageModule } from './shared/storages/storage.module';
import { API_URL } from './shared/helpers/urls.helper';
import { NotifierModule } from 'angular-notifier';
import { MatIconModule } from '@angular/material/icon';
import { WINDOW_PROVIDERS } from './shared/services/window.service';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { LanguageService } from './shared/services/language.service';
import { DynamicLocaleId } from './shared/translates/dynamic-locale.id';
import { TranslateLoader } from '@ngx-translate/core';
import { CoffeephoneTranslateModule } from './shared/translates/coffeephone-translate.module';
import { translationInitLoader } from './shared/translates/po-loaders/translation-init-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { NotifierOptions } from 'angular-notifier/lib/models/notifier-config.model';
import { JwtModuleOptions } from '@auth0/angular-jwt/lib/angular-jwt.module';
import { LongResponseInterceptor } from './shared/interceptors/long-response.interceptor';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { UserTokenStorageKey } from './shared/helpers/auth-user.helper';
import { CookieModule, CookieService } from 'ngx-cookie';
import { TransferHttpCacheModule } from '@nguniversal/common';

const notifierOptions: NotifierOptions = {
  behaviour: {
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: false,
    stacking: 1,
  },
  position: {
    horizontal: {
      position: 'middle',
      distance: 20,

    },
    vertical: {
      position: 'bottom',
      distance: 20,
      gap: 15,
    },
  },
};

function jwtOptionsFactory(cookie: CookieService) {
  return {
    tokenGetter: () => cookie.get(UserTokenStorageKey),
  };
}

const jwtOptions: JwtModuleOptions = {
  jwtOptionsProvider: {
    provide: JWT_OPTIONS,
    useFactory: jwtOptionsFactory,
    deps: [CookieService],
  },
  config: {
    headerName: null,
    authScheme: 'Bearer ',
    allowedDomains: [environment.API_URL],
    throwNoTokenError: true,
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    JwtModule.forRoot(jwtOptions),
    StorageModule.forRoot(),
    appRoutes,
    SharedModule,
    HttpClientModule,
    TransferHttpCacheModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NotifierModule.withConfig(notifierOptions),
    MatIconModule,
    CoffeephoneTranslateModule.forRoot(),
    CookieModule.forRoot({
      path: '/',
      expires: (new Date().getFullYear() + 1 + '-12-31T22:00:00.000Z'),
    }),
  ],
  providers: [
    JwtHelperService,
    HttpClient,
    MatSnackBar,
    WINDOW_PROVIDERS,
    {provide: API_URL, useValue: environment.API_URL},
    {provide: HTTP_INTERCEPTORS, useClass: ApiUrlInterceptor, multi: true, deps: [API_URL]},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LongResponseInterceptor, multi: true},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: HttpBackend, useExisting: HttpXhrBackend},
    {
      provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
      useValue: {
        showDelay: 500,
        hideDelay: 150,
        touchendHideDelay: 1500,
      } as MatTooltipDefaultOptions,
    },
    {
      provide: LOCALE_ID,
      deps: [LanguageService],
      useClass: DynamicLocaleId,
    },
    {
      provide: MAT_DATE_LOCALE,
      deps: [LanguageService],
      useClass: DynamicLocaleId,
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {
      provide: APP_INITIALIZER,
      useFactory: translationInitLoader,
      deps: [TranslateLoader, CookieService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
  }
}
