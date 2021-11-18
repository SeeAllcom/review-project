import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaqComponent } from './faq.component';
import { MatIconModule } from '@angular/material/icon';
import { FaqNavigationComponent } from './faq-navigation/faq-navigation.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { WindowScrollSpyDirective } from '../../directives/window-scroll-spy.directive';
import { MarkdownModule } from 'ngx-markdown';
import { ObjectsModule } from '../../objects/objects.module';
import { SharedModule } from '../../shared.module';
import { FaqCategoriesResolver } from './faq-categories.resolver';

@NgModule({
  declarations: [
    FaqComponent,
    FaqNavigationComponent,
    WindowScrollSpyDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: FaqComponent, resolve: {categories: FaqCategoriesResolver }},
    ]),
    MatIconModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
    }),
    TranslateModule,
    MatExpansionModule,
    RouterModule,
    ObjectsModule,
    SharedModule,
  ],
  exports: [FaqComponent],
})
export class FaqModule {
}
