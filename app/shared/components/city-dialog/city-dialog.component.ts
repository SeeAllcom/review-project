import { Component, OnInit } from '@angular/core';
import { first, take } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreaInterface, Region } from '../../helpers/cities.helper';
import { CitiesService } from '../../services/cities.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'city-dialog',
  templateUrl: './city-dialog.component.html',
  styleUrls: ['./city-dialog.component.scss'],
})
export class CityDialogComponent implements OnInit {
  searchValue: string = '';
  getCitiesSub = Subscription.EMPTY;
  cities: AreaInterface[] = [];
  selectCityForm: FormGroup = new FormGroup({
    city: new FormControl(null, [Validators.required]),
  });
  areaFilterCtrl: FormControl = new FormControl();
  filteredArea: ReplaySubject<AreaInterface[]> = new ReplaySubject<AreaInterface[]>(1);

  constructor(
    private citiesService: CitiesService,
    private translate: TranslateService,
    private dialog: MatDialogRef<CityDialogComponent>,
  ) {
  }

  ngOnInit(): void {
    this.getCities();
    this.getCurrentCityValue();
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

  compareObjects(o1: Region, o2: Region): boolean {
    if (o1 && o2) {
      return o1.id === o2.id && o1.name_en === o2.name_en;
    } else {
      return false;
    }
  }

  getCurrentCityValue() {
    this.citiesService.currentCity$
      .pipe(first(), untilDestroyed(this))
      .subscribe((city) => {
        this.selectCityForm.controls['city'].setValue(city);
      });
  }

  saveCity() {
    if (this.selectCityForm.valid) {
      this.dialog.close();
      this.citiesService.setCity(this.selectCityForm.value.city);
    }
  }

  filterAreas() {
    return this.citiesService.filterAreas(this.cities, this.filteredArea, this.areaFilterCtrl);
  }
}
