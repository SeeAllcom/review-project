import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModule } from './app.module';
import { BrowserTransferStateModule, HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';
import { MyHammerConfig } from './hammerConfig';
import { StateTransferInitializerModule, TransferHttpCacheModule } from '@nguniversal/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GraphCmsHeadersInterceptor } from './shared/seo/graph-cms/graph-cms-header.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { translateLoaderFactory } from './shared/translates/translate-helper';
import { BrowserTransferStateInterceptor } from './shared/interceptors/browser-transfer-state.interceptor';

@NgModule({
  declarations: [],
  imports: [
    AppModule,
    CommonModule,
    HammerModule,
    BrowserTransferStateModule,
    StateTransferInitializerModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BrowserTransferStateInterceptor,
      multi: true,
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GraphCmsHeadersInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppBrowserModule { }
