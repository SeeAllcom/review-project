import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { ReplaySubject, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkEstablishmentsService } from '../../../../services/owner/network-establishments.service';
import { AreaInterface } from '../../../../helpers/cities.helper';
import { CitiesService } from '../../../../services/cities.service';
import { getLocalizationCityKey } from '../../../../translates/cities-translate.helper';
import { environment } from '../../../../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'edit-network-establishment',
  templateUrl: './edit-network-establishment.component.html',
})
export class EditNetworkEstablishmentComponent implements OnInit {
  error: string = '';
  updatingSub = Subscription.EMPTY;
  getCitiesSub = Subscription.EMPTY;
  data = this.establishmentData;
  cities: AreaInterface[] = [];
  areaFilterCtrl: FormControl = new FormControl();
  filteredArea: ReplaySubject<AreaInterface[]> = new ReplaySubject<AreaInterface[]>(1);
  API_URL = environment.API_URL;
  form: FormGroup = new FormGroup({
    address: new FormControl(this.data.address, [Validators.required]),
    img: new FormControl(this.data.img, [Validators.required]),
    region_id: new FormControl(this.data.region_id, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public establishmentData: any,
    private networkEstablishmentsService: NetworkEstablishmentsService,
    private dialogRef: MatDialogRef<EditNetworkEstablishmentComponent>,
    private citiesService: CitiesService,
  ) { }

  ngOnInit(): void {
    this.getCities();
  }

  getCities() {
    this.getCitiesSub = this.citiesService.getCities(true, true)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((citiesData) => {
        this.cities = citiesData.areas;
        this.filteredArea.next(this.citiesService.copyArea(this.cities));
        this.areaFilterCtrl.valueChanges
          .pipe(untilDestroyed(this))
          .subscribe(() => {
            this.filterAreas();
          });
      });
  }

  updateEstablishment() {
    this.updatingSub = this.networkEstablishmentsService.updateEstablishment(
      this.form.value, this.establishmentData.id)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(
        () => { this.dialogRef.close(true); },
        (res) => {
          this.error = getBackendMessage(res?.errors?.img);
        },
      );
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  filterAreas() {
    return this.citiesService.filterAreas(this.cities, this.filteredArea, this.areaFilterCtrl);
  }
}
