import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { CookieBackendModule } from 'ngx-cookie-backend';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PoServerLoader } from './shared/translates/po-loaders/po-server-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerTransferStateInterceptor } from './shared/interceptors/server-transfer-state.interceptor';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    CookieBackendModule.forRoot({
      path: '/',
      expires: (new Date().getFullYear() + 1 + '-12-31T22:00:00.000Z'),
    }),
    ServerTransferStateModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useClass: PoServerLoader,
        deps: [],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerTransferStateInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
