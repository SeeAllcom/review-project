import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AbonementInterface,
  AbonementSupplementInterface, RequestBodyAbonementInterface,
} from '../../../helpers/abonements.helper';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectedAbonementsService } from '../../../services/selected-abonements.service';

interface AbonementData {
  abonement: AbonementInterface;
}

@Component({
  selector: 'abonement-preview',
  templateUrl: './abonement-preview.component.html',
})
export class AbonementPreviewComponent implements OnInit {
  abonement: AbonementInterface = this.abonementData.abonement;
  imgEnlarged: boolean = false;
  supplements: AbonementSupplementInterface[] = [];
  getSupplementsSub = Subscription.EMPTY;
  API_URL = environment.API_URL;

  constructor(
    private selectedAbonementsService: SelectedAbonementsService,
    @Inject(MAT_DIALOG_DATA) public abonementData: AbonementData,
  ) { }

  ngOnInit(): void {
  }

  getSelectedAbonementsByAbonementId(): RequestBodyAbonementInterface[] {
    return this.selectedAbonementsService.getSelectedAbonementsByAbonementId(this.abonement.product.id);
  }

  getSelectedAbonementsCountByAbonementId(): number {
    return this.selectedAbonementsService.getSelectedAbonementsCountByAbonementId(this.abonement.product.id);
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

  addAbonementsByInput(supplement: AbonementSupplementInterface, event: Event): void {
    this.selectedAbonementsService.addAbonementsByInput(supplement, this.abonement, event);
  }

  removeSupplementQuantity(supplement: AbonementSupplementInterface, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedAbonementsService.removeOptionQuantity(supplement);
  }
}
