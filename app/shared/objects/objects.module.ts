import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipComponent } from './tooltip/tooltip.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputPasswordComponent } from './input-password/input-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { NotificationComponent } from './notification/notification.component';
import { MatRippleModule } from '@angular/material/core';
import { FriendsSelectComponent } from './friends-select/friends-select.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { NumberSliderComponent } from './number-slider/number-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

const SHARED_INSTANCES = [
  SpinnerComponent,
  TooltipComponent,
  InputPasswordComponent,
  ScrollTopComponent,
  NotificationComponent,
  FriendsSelectComponent,
];

@NgModule({
  declarations: [
    ...SHARED_INSTANCES,
    SearchInputComponent,
    NumberSliderComponent,
    ConfirmDialogComponent,
  ],
  exports: [
    ...SHARED_INSTANCES,
    SearchInputComponent,
    NumberSliderComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatTooltipModule,
    TranslateModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    FormsModule,
    MatSliderModule,
    MatDialogModule,
  ],
})
export class ObjectsModule {
}
