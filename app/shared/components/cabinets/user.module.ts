import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { UserCabinetComponent } from './user-cabinet/user-cabinet.component';
import { MyAbonementsComponent } from './my-abonements/my-abonements.component';
import { EstablishmentsAbonementsComponent } from './establishments-abonements/establishments-abonements.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ObjectsModule } from '../../objects/objects.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '../../shared.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ClipboardModule } from 'ngx-clipboard';
import { FriendsComponent } from './friends/friends.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialFileInputModule } from 'ngx-mat-file-input';

@NgModule({
  declarations: [
    UserComponent,
    UserCabinetComponent,
    MyAbonementsComponent,
    EstablishmentsAbonementsComponent,
    OrderSuccessComponent,
    FriendsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', redirectTo: 'user', pathMatch: 'full'},
      {path: 'user', component: UserCabinetComponent},
      {path: 'friends', component: FriendsComponent},
      {path: ':establishment/season-tickets', component: MyAbonementsComponent},
      {path: 'establishments-abonements', component: EstablishmentsAbonementsComponent},
      {path: 'order-success', component: OrderSuccessComponent},
    ]),
    TranslateModule,
    ReactiveFormsModule,
    MatIconModule,
    ObjectsModule,
    MatFormFieldModule,
    SharedModule,
    LazyLoadImageModule,
    MatCheckboxModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
    SwiperModule,
    MatButtonToggleModule,
    ClipboardModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    FormsModule,
    MaterialFileInputModule,
  ],
  exports: [
    UserComponent,
  ],
})
export class UserModule { }
