import { Component, OnInit } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AreaInterface, Region } from '../../../../helpers/cities.helper';
import { CitiesService } from '../../../../services/cities.service';
import { MatDialogRef } from '@angular/material/dialog';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { NetworkEstablishmentsService } from '../../../../services/owner/network-establishments.service';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'add-network-establishment',
  templateUrl: './add-network-establishment.component.html',
})
export class AddNetworkEstablishmentComponent implements OnInit {
  error: string = '';
  addingSub = Subscription.EMPTY;
  getCitiesSub = Subscription.EMPTY;
  cities: AreaInterface[] = [];
  form: FormGroup = new FormGroup({
    address: new FormControl('', [Validators.required]),
    img: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
  });
  areaFilterCtrl: FormControl = new FormControl();
  filteredArea: ReplaySubject<AreaInterface[]> = new ReplaySubject<AreaInterface[]>(1);

  constructor(
    private translate: TranslateService,
    private citiesService: CitiesService,
    private networkEstablishmentsService: NetworkEstablishmentsService,
    private dialogRef: MatDialogRef<AddNetworkEstablishmentComponent>,
  ) {
  }

  ngOnInit(): void {
    this.getCities();
  }

  getCities() {
    this.getCitiesSub = this.citiesService.getCities(false, true)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((citiesData) => {
          this.cities = citiesData.areas;
          this.filteredArea.next(this.citiesService.copyArea(this.cities));
          this.areaFilterCtrl.valueChanges
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.filterAreas();
            });
        },
        (res) => this.error = getBackendMessage(res.message),
      );
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

  addEstablishment() {
    if (this.form.valid) {
      this.addingSub = this.networkEstablishmentsService.addEstablishment(this.form.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => this.dialogRef.close(true),
          (res) => this.error = res?.errors?.img
            ? getBackendMessage(res?.errors?.img)
            : getBackendMessage(res.message),
        );
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  filterAreas() {
    return this.citiesService.filterAreas(this.cities, this.filteredArea, this.areaFilterCtrl);
  }
}
