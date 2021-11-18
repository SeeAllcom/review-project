import { Component, Input, OnInit } from '@angular/core';
import {
  AbonementInterface,
  AbonementSupplementInterface,
  RequestBodyAbonementInterface,
} from '../../../../helpers/abonements.helper';
import { SelectedAbonementsService } from '../../../../services/selected-abonements.service';

@Component({
  selector: 'abonement-supplements',
  templateUrl: './abonement-supplements.component.html',
})
export class AbonementSupplementsComponent implements OnInit {
  @Input() abonement: AbonementInterface = null;
  @Input() supplements: AbonementSupplementInterface[] = [];

  constructor(
    private selectedAbonementsService: SelectedAbonementsService,
  ) { }

  ngOnInit(): void {
  }

  toggleAbonementSupplement(supplement: AbonementSupplementInterface): void {
    this.selectedAbonementsService.toggleAbonementSupplementOption(supplement, this.abonement);
  }

  isSupplementDisabled(supplementId: number): boolean {
    return this.selectedAbonementsService.isOptionDisabled(supplementId);
  }

  isSupplementDeleted(supplement: AbonementSupplementInterface): boolean {
    return this.selectedAbonementsService.isSupplementDeleted(supplement);
  }

  isSupplementSelected(supplementId: number): boolean {
    return this.selectedAbonementsService.isOptionSelected(supplementId);
  }

  getSelectedSupplement(supplementId: number) {
    return this.selectedAbonementsService.getSelectedAbonement(supplementId);
  }

  addSupplementQuantity(supplement: AbonementSupplementInterface, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedAbonementsService.addSupplementOptionQuantity(supplement, this.abonement);
  }

  removeSupplementQuantity(supplement: AbonementSupplementInterface, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedAbonementsService.removeOptionQuantity(supplement);
  }
}
