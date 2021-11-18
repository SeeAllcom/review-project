import { Component, OnInit } from '@angular/core';
import { NetworkProductsService } from '../../../../services/owner/network-products.service';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  CategoriesInterface,
  ProductCapacityData,
} from '../../../../helpers/products.helper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { getLocalizationCategoriesKey } from '../../helpers/network.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

@UntilDestroy()
@Component({
  selector: 'add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
})
export class AddProductDialogComponent implements OnInit {
  error: string = '';
  addingSub = Subscription.EMPTY;
  allCategories: CategoriesInterface[] = [];
  formProduct: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    capacity: new FormGroup({
      size: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
    }),
    description: new FormControl(''),
    can_purchase_as_abonement: new FormControl(false),
    img: new FormControl('', [Validators.required]),
    category_id: new FormControl('', [Validators.required]),
  });
  productCapacityData = ProductCapacityData;
  formProductSupplements: FormGroup = this.formBuilder.group({
    supplements: this.formBuilder.array([]),
  });

  constructor(
    private networkProductsService: NetworkProductsService,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
  ) {
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getSupplementsValue(value: FormGroup) {
    this.formProductSupplements = value;
  }

  getAllCategories() {
    this.networkProductsService.getAllCategories()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((categories) => {
        this.allCategories = categories.categories;
      });
  }

  getCategoryName(name: string) {
    return getLocalizationCategoriesKey(name);
  }

  addProduct() {
    if (this.formProduct.valid && this.formProductSupplements.valid) {
      this.addingSub = this.networkProductsService.addProduct(this.formProduct.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe((res: any) => {
            if (this.formProductSupplements.get('supplements').value.length > 0) {
              this.addProductSupplements(res.created_product.id, res.created_product.category_id);
            } else {
              this.dialogRef.close(res.created_product.category_id);
            }
          },
          (res) => {
            if (res && res.errors && res.errors.img) {
              this.error = getBackendMessage(res?.errors?.img);
            } else {
              this.error = getBackendMessage(res.message);
            }
          },
        );
    }
  }

  addProductSupplements(productId: number, categoryId: number) {
    this.addingSub = this.networkProductsService.addProductSupplements(
      this.formProductSupplements.get('supplements').value,
      productId,
    ).pipe(take(1), untilDestroyed(this)).subscribe(() => this.dialogRef.close(categoryId),
      () => this.notifier.notify('error', this.translate.instant(marker('Добавки товару не вдалося завантажити'))));
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
