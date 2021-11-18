import { Routes, RouterModule } from '@angular/router';
import { CitiesComponent } from './shared/components/cities/cities.component';
import { EstablishmentsComponent } from './shared/components/establishments/establishments.component';
import { ProductsComponent } from './shared/components/products/products.component';
import { SmallCitiesComponent } from './shared/components/cities/small-cities/small-cities.component';
import { EstablishmentLoginComponent } from './shared/components/owner-establishment/establishment-login/establishment-login.component';
import { WorkerAuthGuard } from './shared/classes/guards/worker-auth.guard';
import { ConfirmedEmailComponent } from './shared/components/login/confirmed-email/confirmed-email.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ConfirmationRegistrationEstablishmentComponent } from './shared/components/login/confirmation-registration-establishment/confirmation-registration-establishment.component';
import { UserAuthGuard } from './shared/classes/guards/user-auth.guard';

const HEADER_HEIGHT = 65;

const routes: Routes = [
  {path: '', component: CitiesComponent},
  {path: ':city/cities', component: SmallCitiesComponent},
  {path: ':city/purchase-establishments', component: EstablishmentsComponent},
  {path: 'establishment/:establishment', component: ProductsComponent},
  {path: 'network/login', component: EstablishmentLoginComponent},
  {
    path: 'what-is-coffeephone',
    loadChildren: () => import('./shared/info-pages/what-coffeephone/what-coffeephone.module')
      .then((m) => m.WhatCoffeephoneModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./shared/info-pages/privacy-policy/privacy-policy.module')
      .then((m) => m.PrivacyPolicyModule),
  },
  {
    path: 'terms-of-use',
    loadChildren: () => import('./shared/info-pages/terms-of-use/terms-of-use.module')
      .then((m) => m.TermsOfUseModule),
  },
  {
    path: 'network/for-partners',
    loadChildren: () => import('./shared/info-pages/for-establishments/for-establishments.module')
      .then((m) => m.ForEstablishmentsModule),
  },
  {
    path: 'faq',
    loadChildren: () => import('./shared/info-pages/faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'cabinet',
    canActivate: [UserAuthGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./shared/components/cabinets/user.module').then((m) => m.UserModule),
  },
  {
    path: 'network',
    canActivate: [WorkerAuthGuard],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./shared/components/owner-establishment/owner-establishment.module')
      .then((m) => m.OwnerEstablishmentModule),
  },
  {path: 'register/confirmed-email/:token', component: ConfirmedEmailComponent},
  {path: 'registration/confirmation-registration/:token', component: ConfirmationRegistrationEstablishmentComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'},
];

export const appRoutes = RouterModule.forRoot(routes, {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  initialNavigation: 'enabled',
  scrollOffset: [0, HEADER_HEIGHT],
  useHash: true,
  relativeLinkResolution: 'legacy',
  onSameUrlNavigation: 'reload',
});
