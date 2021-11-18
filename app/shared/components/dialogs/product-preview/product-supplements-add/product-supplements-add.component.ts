import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddToCartProductInterface,
  ProductSupplementInterface, ProductSupplementOptionsInterface,
} from '../../../../helpers/products.helper';
import { SelectedProductsService } from '../../../../services/selected-products.service';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'product-supplements-add',
  templateUrl: './product-supplements-add.component.html',
})
export class ProductSupplementsAddComponent implements OnInit {
  @Input() product: AddToCartProductInterface = null;
  @Input() productQuantity: number;
  @Input() supplements: ProductSupplementInterface[] = [];
  @Input() needAddNewProductToCart$: BehaviorSubject<boolean>;
  @Output() supplementsPrice = new EventEmitter<number>();
  formProductSupplements: FormGroup = this.formBuilder.group({
    supplements: this.formBuilder.array([]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private selectedProductsService: SelectedProductsService,
  ) {
  }

  ngOnInit(): void {
    if (this.supplements.length) {
      this.setSupplements();
    }
    this.needAddNewProductToCart$.pipe(filter((state) => !!state), untilDestroyed(this))
      .subscribe(() => {
        this.addNewProductToCart();
        this.needAddNewProductToCart$.next(false);
      });
  }

  getFormControls(form: FormArray | FormGroup, control: string) {
    return form.controls[control].controls;
  }

  setSupplements() {
    const control = this.formProductSupplements.controls['supplements'] as FormArray;
    this.supplements.forEach((supplement) => {
      control.push(this.formBuilder.group({
        id: supplement.id,
        name: supplement.name,
        required: supplement.required,
        choice_only_one: supplement.choice_only_one,
        max_options: supplement.max_options,
        options: this.setOptions(supplement.options),
      }));
    });
  }

  setOptions(options: ProductSupplementOptionsInterface[]) {
    const arr = new FormArray([], Validators.minLength(1));
    options.forEach((option) => {
      arr.push(this.formBuilder.group({
        bonus: option.bonus,
        id: option.id,
        name: option.name,
        price: option.price,
        product_id: option.product_id,
        quantity: 0,
        supplement_id: option.supplement_id,
      }));
    });
    return arr;
  }

  initSupplementsPrice() {
    const supplements = this.formProductSupplements.get('supplements').value;
    let price = 0;
    if (supplements.length) {
      supplements.reduce((a, b) => {
        if (a && a.options && b && b.options) {
          const priceOptionsA = a.options.filter((option) =>  option.price)
            .reduce((c, d) => c + (d.price * d.quantity), 0);
          const priceOptionsB = b.options.filter((option) => option.price)
            .reduce((c, d) => c + (d.price * d.quantity), 0);
          price = priceOptionsA + priceOptionsB;
        }
      });
    }
    this.supplementsPrice.emit(price);
  }

  toggleProductSupplements(option: FormGroup, supplement: FormGroup) {
    if (!this.isOptionDisabled(option, supplement)) {
      option.controls.quantity.value > 0 ? option.controls.quantity.setValue(0) : option.controls.quantity.setValue(1);
      this.initSupplementsPrice();
    }
  }

  removeOptionQuantity(option: FormGroup, event: Event) {
    event.stopPropagation();
    let optionQuantity = option.controls.quantity.value;
    if (option.controls.quantity.value > 0) {
      optionQuantity--;
    }
    option.controls.quantity.setValue(optionQuantity);
    this.initSupplementsPrice();
  }

  addOptionQuantity(option: FormGroup, supplement: FormGroup, event: Event) {
    event.stopPropagation();
    const maxOptions = supplement.controls.max_options.value;
    const isCanBeAdded = maxOptions !== null ? this.getTotalNumberOptions(supplement) < maxOptions : true;
    if (isCanBeAdded) {
      let optionQuantity = option.controls.quantity.value;
      optionQuantity++;
      option.controls.quantity.setValue(optionQuantity);
      this.initSupplementsPrice();
    }
  }

  isOptionSelected(option: FormGroup) {
    return option.controls.quantity.value > 0;
  }

  isOptionDisabled(option: FormGroup, supplement: FormGroup) {
    if (supplement.controls.options.value && supplement.controls.options.value.length > 0) {
      const selectedOptionsNumber = supplement.controls.options.value.filter((o) => o.quantity > 0).length;
      const maxOpts = supplement.controls.max_options.value;
      if (!maxOpts) {
        return false;
      }
      return (selectedOptionsNumber >= maxOpts || this.getTotalNumberOptions(supplement) >= maxOpts)
        && !this.isOptionSelected(option);
    }
    return false;
  }

  getGroupSelectedOptions(supplement: FormGroup) {
    if (supplement.controls.options.value.length > 0) {
      return supplement.controls.options.value.filter((o) => o.supplement_id === supplement.controls.id.value);
    }
    return [];
  }

  getTotalNumberOptions(supplement: FormGroup) {
    return this.getGroupSelectedOptions(supplement).reduce((a, b) => a + +b.quantity, 0);
  }

  addNewProductToCart() {
    this.selectedProductsService.addNewProductToCart(
      this.product,
      this.formProductSupplements.controls.supplements.value,
      this.productQuantity,
    );
  }
}
