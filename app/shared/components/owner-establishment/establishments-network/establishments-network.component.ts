import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { Region } from '../../../helpers/cities.helper';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { CitiesService } from '../../../services/cities.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { AddNetworkEstablishmentComponent } from './add-network-establishment/add-network-establishment.component';
import { NetworkEstablishmentsService } from '../../../services/owner/network-establishments.service';
import { CoffeeShopInterface, NetworkEstablishments } from '../helpers/network.helper';
import { environment } from '../../../../../environments/environment';
import { UserLoginQuery } from '../../../../states/user-login/user-login.query';
import { EditNetworkEstablishmentComponent } from './edit-network-establishment/edit-network-establishment.component';
import {
  ConfirmDeleteDialogComponent,
  ConfirmDeleteInterface,
} from '../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { getBackendMessage } from '../../../helpers/errors.helper';
import { NotifierService } from 'angular-notifier';

@UntilDestroy()
@Component({
  selector: 'establishments-network',
  templateUrl: './establishments-network.component.html',
  styleUrls: ['./establishments-network.component.scss'],
})
export class EstablishmentsNetworkComponent implements OnInit {
  searchValue: string = '';
  getEstablishmentsError: string = '';
  establishment: number | null = null;
  areasWithEstablishments: NetworkEstablishments[] = [];
  establishments: NetworkEstablishments[] = [];
  getEstablishmentsSub = Subscription.EMPTY;
  deleteEstablishmentSub = Subscription.EMPTY;
  areaFilterCtrl: FormControl = new FormControl();
  filteredArea: ReplaySubject<NetworkEstablishments[]> = new ReplaySubject<NetworkEstablishments[]>(1);
  API_URL = environment.API_URL;
  isOwnerLoggedIn$ = this.userLoginQuery.isOwnerLoggedIn$;
  cityForm = new FormGroup({
    city: new FormControl(''),
  });

  constructor(
    private networkEstablishmentsService: NetworkEstablishmentsService,
    private citiesService: CitiesService,
    private translate: TranslateService,
    private notifierService: NotifierService,
    private dialog: MatDialog,
    private userLoginQuery: UserLoginQuery,
  ) {
  }

  ngOnInit(): void {
    this.getEstablishments();
  }

  getEstablishments() {
    this.getEstablishmentsError = '';
    this.getEstablishmentsSub = this.networkEstablishmentsService.getEstablishment()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((establishments) => {
          this.cityForm.controls['city'].setValue('');
          this.establishment = null;
          this.areasWithEstablishments = establishments.areas;
          this.establishments = establishments.areas;
          this.filteredArea.next(this.copyArea(this.establishments));
          this.areaFilterCtrl.valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.filterAreas();
            });
        },
        (res) => {
          this.getEstablishmentsError = getBackendMessage(res.message);
        },
      );
  }

  openAddEstablishmentDialog() {
    this.dialog.open(AddNetworkEstablishmentComponent).afterClosed()
      .pipe(filter((state) => !!state), take(1), untilDestroyed(this))
      .subscribe(() => this.getEstablishments());
  }

  editEstablishment(coffeeShop: CoffeeShopInterface) {
    this.dialog.open(EditNetworkEstablishmentComponent, {data: coffeeShop}).afterClosed()
      .pipe(filter((state) => !!state), take(1), untilDestroyed(this))
      .subscribe(() => this.getEstablishments());
  }

  deleteEstablishment(establishment: CoffeeShopInterface) {
    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        deleteFunc: () => this.networkEstablishmentsService.deleteEstablishment(establishment),
      } as ConfirmDeleteInterface,
    }).afterClosed()
      .pipe(filter((isDeleted) => !!isDeleted), take(1), untilDestroyed(this))
      .subscribe(() => this.getEstablishments());
  }

  getEstablishmentsForSomeCity(region: Region) {
    this.networkEstablishmentsService.getEstablishmentsForSomeCity(region.id)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((establishments) => {
        this.establishment = null;
        this.areasWithEstablishments = establishments.areas;
      });
  }

  compareObjects(o1: Region, o2: Region): boolean {
    if (o1 && o2) {
      return o1.name === o2.name
        && o1.id === o2.id
        && o1.name_en === o2.name_en
        && o1.networks === o2.networks;
    } else {
      return false;
    }
  }

  filterAreas() {
    return this.citiesService.filterAreas(this.establishments, this.filteredArea, this.areaFilterCtrl);
  }

  copyArea(areas: any) {
    return this.citiesService.copyArea(areas);
  }
}
