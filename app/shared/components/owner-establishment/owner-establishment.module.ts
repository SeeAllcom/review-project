import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerSettingsComponent } from './owner-settings/owner-settings.component';
import { EstablishmentLoginComponent } from './establishment-login/establishment-login.component';
import { OwnerEstablishmentComponent } from './owner-establishment.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterModule } from '@angular/router';
import { EstablishmentsNetworkComponent } from './establishments-network/establishments-network.component';
import { ObjectsModule } from '../../objects/objects.module';
import { OwnerEditingDialogComponent } from './owner-settings/owner-editing-dialog/owner-editing-dialog.component';
import { MaterialFileInputModule } from 'ngx-mat-file-input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { OwnerProductsComponent } from './owner-products/owner-products.component';
import { OwnerProductEditingComponent } from './owner-products/owner-product-editing/owner-product-editing.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NetworkWorkersComponent } from './network-workers/network-workers.component';
import { AddProductDialogComponent } from './owner-products/add-product-dialog/add-product-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared.module';
import { AddNetworkEstablishmentComponent } from './establishments-network/add-network-establishment/add-network-establishment.component';
import { EditNetworkEstablishmentComponent } from './establishments-network/edit-network-establishment/edit-network-establishment.component';
import { AddNetworkWorkerComponent } from './network-workers/add-network-worker/add-network-worker.component';
import { ConfirmDeleteDialogComponent } from './dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { NetworkHistoryComponent } from './network-history/network-history.component';
import { HistoryPurchaseComponent } from './network-history/history-purchase/history-purchase.component';
import { HistoryWriteoffComponent } from './network-history/history-writeoff/history-writeoff.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { EditNetworkWorkerComponent } from './network-workers/edit-network-worker/edit-network-worker.component';
import { HistoryPresentComponent } from './network-history/history-present/history-present.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { OwnerAuthGuard } from '../../classes/guards/owner-auth.guard';
import { NetworkWorkersService } from '../../services/owner/network-workers.service';
import { NetworkSettingsService } from '../../services/owner/network-settings.service';
import { NetworkProductsService } from '../../services/owner/network-products.service';
import { NetworkHistoryService } from '../../services/owner/network-history.service';
import { NetworkEstablishmentsService } from '../../services/owner/network-establishments.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReportComponent } from './report/report.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReportService } from './report/report.service';
import { WorkerEditingDialogComponent } from './owner-settings/worker-editing-dialog/worker-editing-dialog.component';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { ProductSupplementsComponent } from './owner-products/product-supplements/product-supplements.component';
import { AbonementsComponent } from './abonements/abonements.component';
import { MatSliderModule } from '@angular/material/slider';
import { ActionsAbonementComponent } from './abonements/actions-abonement/actions-abonement.component';
import { WorkScheduleDialogComponent } from './owner-settings/work-schedule-dialog/work-schedule-dialog.component';
import { WorkScheduleComponent } from './owner-settings/work-schedule/work-schedule.component';
import { NetworkAbonementsService } from '../../services/owner/network-abonements.service';

@NgModule({
  declarations: [
    OwnerSettingsComponent,
    EstablishmentLoginComponent,
    OwnerEstablishmentComponent,
    OwnerEditingDialogComponent,
    OwnerProductsComponent,
    OwnerProductEditingComponent,
    EstablishmentsNetworkComponent,
    QrCodeScannerComponent,
    NetworkWorkersComponent,
    AddProductDialogComponent,
    AddNetworkEstablishmentComponent,
    EditNetworkEstablishmentComponent,
    AddNetworkWorkerComponent,
    ConfirmDeleteDialogComponent,
    NetworkHistoryComponent,
    HistoryPurchaseComponent,
    HistoryWriteoffComponent,
    EditNetworkWorkerComponent,
    HistoryPresentComponent,
    ReportComponent,
    WorkerEditingDialogComponent,
    ImagePreviewComponent,
    ProductSupplementsComponent,
    AbonementsComponent,
    ActionsAbonementComponent,
    WorkScheduleDialogComponent,
    WorkScheduleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: OwnerEstablishmentComponent,
        children: [
          {path: '', redirectTo: 'report', pathMatch: 'full'},
          {path: 'report', component: ReportComponent},
          {path: 'products', component: OwnerProductsComponent},
          {path: 'abonements', component: AbonementsComponent},
          {path: 'establishments', component: EstablishmentsNetworkComponent, canActivate: [OwnerAuthGuard]},
          {path: 'workers', component: NetworkWorkersComponent, canActivate: [OwnerAuthGuard]},
          {path: 'settings', component: OwnerSettingsComponent},
        ],
      },
    ]),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    LazyLoadImageModule,
    RouterModule,
    MaterialFileInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ZXingScannerModule,
    ObjectsModule,
    MatTooltipModule,
    SharedModule,
    TranslateModule,
    NgbPaginationModule,
    MatCheckboxModule,
    MatSortModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatSlideToggleModule,
    NgxQRCodeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
  ],
  providers: [
    NetworkWorkersService,
    NetworkSettingsService,
    NetworkProductsService,
    NetworkHistoryService,
    NetworkEstablishmentsService,
    MatDatepickerModule,
    ReportService,
    NetworkAbonementsService,
  ],
  exports: [],
})
export class OwnerEstablishmentModule { }
