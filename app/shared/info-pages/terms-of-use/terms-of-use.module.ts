import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TermsOfUseComponent } from './terms-of-use.component';
import { TranslateModule } from '@ngx-translate/core';
import { ObjectsModule } from '../../objects/objects.module';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    TermsOfUseComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: TermsOfUseComponent},
    ]),
    TranslateModule,
    ObjectsModule,
    MatIconModule,
    SharedModule,
  ],
})
export class TermsOfUseModule { }
