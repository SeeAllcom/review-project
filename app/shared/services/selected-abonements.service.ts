import { Injectable } from '@angular/core';
import { LocalStorage } from '../storages/interfaces/local-storage.interface';
import {
  AbonementInterface, AbonementsForOrder, AbonementSupplementInterface, RequestBodyAbonementInterface,
} from '../helpers/abonements.helper';

@Injectable({providedIn: 'root'})
export class SelectedAbonementsService {
  selectedAbonements: RequestBodyAbonementInterface[] = [];

  constructor(
    private customLocalStorage: LocalStorage,
  ) {
    this.selectedAbonements = JSON.parse(this.customLocalStorage.getItem('selected-abonements') || '[]');
  }

  setAbonementRequestBody(
    abonement: AbonementInterface | RequestBodyAbonementInterface,
    supplement: AbonementSupplementInterface,
  ): RequestBodyAbonementInterface {
    return {
      product: abonement.product,
      quantity: abonement.quantity,
      quantityForOrder: 1,
      supplement,
    } as RequestBodyAbonementInterface;
  }

  abonementExistInCart(abonementProductId: number): boolean {
    return this.selectedAbonements.some((el) => el.product.id === abonementProductId);
  }

  addAbonementToCart(
    supplement: AbonementSupplementInterface,
    abonement?: AbonementInterface | RequestBodyAbonementInterface,
  ): void {
    const abonementExist = this.selectedAbonements.find((el) => el.supplement.id === supplement.id);
    if (abonementExist) {
      if (abonementExist.quantityForOrder < abonementExist.supplement.quantity) {
        abonementExist.quantityForOrder++;
      }
    } else {
      const abonementRequestBody = this.setAbonementRequestBody(abonement, supplement);
      this.selectedAbonements = [abonementRequestBody, ...this.selectedAbonements];
    }
    this.syncSelectedAbonements();
  }

  removeQuantitySelectedAbonement(abonement: RequestBodyAbonementInterface): void {
    const abonementExist = this.selectedAbonements.find((el) => el.supplement.id === abonement.supplement.id);
    if (abonementExist.quantityForOrder !== 1) {
      abonementExist.quantityForOrder--;
      this.syncSelectedAbonements();
    }
  }

  deleteSelectedAbonement(abonement: RequestBodyAbonementInterface): void {
    const abonementExist = this.selectedAbonements.find((el) => el.supplement.id === abonement.supplement.id);
    if (abonementExist) {
      this.selectedAbonements = this.selectedAbonements.filter((el) => el.supplement.id !== abonement.supplement.id);
      this.syncSelectedAbonements();
    }
  }

  getSelectedAbonements(): RequestBodyAbonementInterface[] {
    return this.selectedAbonements;
  }

  clearSelectedAbonements(): void {
    this.selectedAbonements = [];
    this.syncSelectedAbonements();
  }

  toggleAbonementSupplementOption(supplement: AbonementSupplementInterface, abonement: AbonementInterface): void {
    const foundAbonement = this.selectedAbonements.find((el) => el.supplement.id === supplement.id);
    if (foundAbonement) {
      this.selectedAbonements = this.selectedAbonements.filter((el) => el.supplement.id !== supplement.id);
    } else {
      const abonementToCart = this.setAbonementRequestBody(abonement, supplement);
      this.selectedAbonements = [abonementToCart, ...this.selectedAbonements];
    }
    this.syncSelectedAbonements();
  }

  isOptionDisabled(abonementId: number): boolean {
    const foundAbonement = this.selectedAbonements.find((el) => el.supplement.id === abonementId);
    return foundAbonement ? foundAbonement.quantityForOrder === foundAbonement.supplement.quantity : false;
  }

  isOptionSelected(supplementId: number): boolean {
    return this.selectedAbonements.some((el) => el.supplement.id === supplementId);
  }

  getSelectedAbonement(abonementId: number) {
    const foundAbonement = this.selectedAbonements.find((el) => el.supplement.id === abonementId);
    return foundAbonement ? foundAbonement : {quantityForOrder: 0, quantity: 0};
  }

  getSelectedAbonementsByAbonementId(abonementProductId: number): RequestBodyAbonementInterface[] {
    return this.selectedAbonements.filter((el) => el.product.id === abonementProductId);
  }

  getSelectedAbonementsCountByAbonementId(abonementProductId: number): number {
    const filteredAbonements = this.selectedAbonements.filter((el) => el.product.id === abonementProductId);
    if (filteredAbonements) {
      return filteredAbonements.reduce((a, b) => a + b.quantityForOrder, 0);
    }
    return 0;
  }

  getSelectedAbonementsCount(): number {
    if (this.selectedAbonements.length) {
      return this.selectedAbonements.reduce((a, b) => a + b.quantityForOrder, 0);
    }
    return 0;
  }

  isSupplementDeleted(supplement: AbonementSupplementInterface) {
    return supplement.deleted === true;
  }

  addAbonementsByInput(supplement: AbonementSupplementInterface, abonement: AbonementInterface, event: any) {
    const value = +event.target.value.replace(/\D+/g, '');
    if (value && value > 0) {
      const abonementExist = this.selectedAbonements.find((el) => el.supplement.id === supplement.id);
      if (abonementExist) {
        abonementExist.quantityForOrder = value > abonementExist.quantity ? abonementExist.quantity : value;
      } else {
        const abonementToCart = this.setAbonementRequestBody(abonement, supplement);
        abonementToCart.quantityForOrder = value > abonementToCart.quantity ? abonementToCart.quantity : value;
        this.selectedAbonements = [abonementToCart, ...this.selectedAbonements];
      }
    } else {
      this.selectedAbonements = this.selectedAbonements.filter((el) => el.supplement.id !== supplement.id);
    }
    this.syncSelectedAbonements();
  }

  addSupplementOptionQuantity(supplement: AbonementSupplementInterface, abonement: AbonementInterface): void {
    const foundAbonement = this.selectedAbonements.find((el) => el.supplement.id === supplement.id);
    if (!this.isOptionDisabled(supplement.id)) {
      if (foundAbonement) {
        foundAbonement.quantityForOrder++;
      } else {
        const abonementToCart = this.setAbonementRequestBody(abonement, supplement);
        this.selectedAbonements = [abonementToCart, ...this.selectedAbonements];
      }
      this.syncSelectedAbonements();
    }
  }

  removeOptionQuantity(supplement: AbonementSupplementInterface): void {
    const abonementFound = this.selectedAbonements.find((el) => el.supplement.id === supplement.id);
    if (abonementFound) {
      if (abonementFound.quantityForOrder !== 1) {
        abonementFound.quantityForOrder--;
      } else {
        this.selectedAbonements = this.selectedAbonements.filter((o) => o.supplement.id !== supplement.id);
      }
      this.syncSelectedAbonements();
    }
  }

  syncSelectedAbonements(): void {
    this.customLocalStorage.setItem('selected-abonements', JSON.stringify(this.selectedAbonements));
  }

  initSelectedAbonements() {
    const abonementsRequestBody = this.selectedAbonements.map((abonement) => {
      return {
        quantity: abonement.quantityForOrder,
        supplement: abonement.supplement,
      } as RequestBodyAbonementInterface;
    });

    return abonementsRequestBody as RequestBodyAbonementInterface[];
  }
}
