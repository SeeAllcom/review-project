import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForEstablishmentsComponent } from './for-establishments.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../../shared.module';
import { MatRippleModule } from '@angular/material/core';
import { ApplicationRegistrationDialogComponent } from './application-registration-dialog/application-registration-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ObjectsModule } from '../../objects/objects.module';
import { MatDialogModule } from '@angular/material/dialog';
import { SwiperModule } from 'ngx-swiper-wrapper';

@NgModule({
  declarations: [
    ForEstablishmentsComponent,
    ApplicationRegistrationDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: ForEstablishmentsComponent},
    ]),
    TranslateModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskModule.forRoot(),
    SharedModule,
    MatRippleModule,
    MatCheckboxModule,
    ObjectsModule,
    MatDialogModule,
    SwiperModule,
  ],
})
export class ForEstablishmentsModule { }
