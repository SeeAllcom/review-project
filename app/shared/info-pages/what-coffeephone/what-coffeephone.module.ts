import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatCoffeephoneComponent } from './what-coffeephone.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    SharedModule,
    RouterModule.forChild([
      {path: '', component: WhatCoffeephoneComponent},
    ]),
    MatInputModule,
    MatRippleModule,
  ],
  declarations: [
    WhatCoffeephoneComponent,
  ],
  exports: [],
})
export class WhatCoffeephoneModule { }
