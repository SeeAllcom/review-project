import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  AddToCartProductInterface, ProductOperationTypeEnum,
  ProductSupplementInterface, ProductSupplementOptionsInterface,
} from '../../../../helpers/products.helper';
import { ProductsService } from '../../../../services/products.service';
import { SelectedProductsService } from '../../../../services/selected-products.service';

@UntilDestroy()
@Component({
  selector: 'user-product-supplements',
  templateUrl: './product-supplements.component.html',
})
export class ProductSupplementsComponent implements OnInit {
  @Input() product: AddToCartProductInterface = null;
  @Input() supplements: ProductSupplementInterface[] = [];

  constructor(
    private productsService: ProductsService,
    private selectedProductsService: SelectedProductsService,
  ) {
  }

  ngOnInit(): void {
  }

  toggleProductSupplements(option: ProductSupplementOptionsInterface, supplement: ProductSupplementInterface) {
    this.selectedProductsService.toggleProductSupplementOption(option, supplement, this.product);
  }

  isOptionDisabled(supplement: ProductSupplementInterface, optionId: number) {
    return this.selectedProductsService.isOptionDisabled(supplement, optionId, this.product.cartId);
  }

  isSelected(optionId: number) {
    return this.selectedProductsService.isOptionSelected(optionId, this.product.cartId);
  }

  getSelectedOption(optionId: number) {
    return this.selectedProductsService.getSelectedOption(optionId, this.product.cartId);
  }

  getTotalNumberOptions(supplementId: number) {
    return this.selectedProductsService.getTotalNumberOptions(supplementId, this.product.cartId);
  }

  addButtonIsDisabled(supplement: ProductSupplementInterface) {
    if (supplement.max_options === null) {
      return false;
    }
    return this.getTotalNumberOptions(supplement.id) >= supplement.max_options;
  }

  addOptionQuantity(option: ProductSupplementOptionsInterface, supplement: ProductSupplementInterface, event: Event) {
    event.stopPropagation();
    this.selectedProductsService.addSupplementOptionQuantity(option, supplement, this.product);
  }

  removeOptionQuantity(option: ProductSupplementOptionsInterface, supplementId: number, event: Event) {
    event.stopPropagation();
    this.selectedProductsService.removeOptionQuantity(option, supplementId, this.product.cartId);
  }
}
