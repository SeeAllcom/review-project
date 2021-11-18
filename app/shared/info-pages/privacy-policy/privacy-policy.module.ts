import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { ObjectsModule } from '../../objects/objects.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: PrivacyPolicyComponent},
    ]),
    ObjectsModule,
    TranslateModule,
    MatIconModule,
    SharedModule,
  ],
})
export class PrivacyPolicyModule { }
