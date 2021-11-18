import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CategoriesInterface,
  ProductCapacityData,
  ProductInterface, ProductSupplementInterface,
} from '../../../../helpers/products.helper';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkProductsService } from '../../../../services/owner/network-products.service';
import { Subscription } from 'rxjs';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { getLocalizationCategoriesKey } from '../../helpers/network.helper';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';

// tslint:disable-next-line:cyclomatic-complexity
@UntilDestroy()
@Component({
  selector: 'owner-product-editing',
  templateUrl: './owner-product-editing.component.html',
})
export class OwnerProductEditingComponent implements OnInit {
  supplementsData: ProductSupplementInterface[] = [];
  isExistAbonementsWithSupplements: boolean = false;
  API_URL = environment.API_URL;
  allCategories: CategoriesInterface[] = [];
  form: FormGroup = new FormGroup({
    category_id: new FormControl(this.product.category_id ),
    capacity: new FormGroup({
      size: new FormControl(this.product.capacity.size, [Validators.required]),
      unit: new FormControl(this.product.capacity.unit, [Validators.required]),
    }),
    img: new FormControl(this.product.img, [Validators.required]),
    name: new FormControl(this.product.name, [Validators.required]),
    price: new FormControl(this.product.price, [Validators.required]),
    description: new FormControl(this.product.description ? this.product.description : ''),
    inaccessible: new FormControl(this.product.inaccessible),
    hide: new FormControl(this.product.hide),
    can_purchase_as_abonement: new FormControl(this.product.can_purchase_as_abonement),
  });
  formProductSupplements: FormGroup = this.formBuilder.group({
    supplements: this.formBuilder.array([]),
  });
  productCapacityData = ProductCapacityData;
  hideToggle: boolean = this.product.hide;
  inaccessibleToggle: boolean = this.product.inaccessible;
  getSupplementsSub = Subscription.EMPTY;
  updateProductSub = Subscription.EMPTY;
  formProductSupplementsChanged = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: ProductInterface,
    private networkProductsService: NetworkProductsService,
    private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<OwnerProductEditingComponent>,
  ) {
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getProductSupplements();
  }

  getSupplementsValue(value: FormGroup) {
    this.formProductSupplements = value;
    if (!this.formProductSupplementsChanged) {
      this.formProductSupplementsChanged = !!this.formProductSupplements.value;
    }
  }

  getCategoryName(name: string) {
    return getLocalizationCategoriesKey(name);
  }

  getAllCategories() {
    this.networkProductsService.getAllCategories()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((categories) => {
        this.allCategories = categories.categories;
      });
  }

  getProductSupplements() {
    this.getSupplementsSub = this.networkProductsService.getProductSupplements(this.product.id)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(
        (res) => this.supplementsData = res.supplements,
        () => this.notifier.notify('error', this.translate.instant(marker('Добавки товару не вдалося завантажити'))));
  }

  updateProduct() {
    if (this.form.valid && this.formProductSupplements.valid) {
      if (this.form.dirty) {
        this.updateProductSub = this.networkProductsService.updateProduct(this.form.value, this.product.id)
          .pipe(take(1), untilDestroyed(this))
          .subscribe((updateProduct) => {
              this.dialogRef.close(updateProduct.product.category_id);
              this.notifier.notify('success',
                updateProduct.product.name + ' ' + this.translate.instant(marker('успішно оновлений')));
            },
            (res) => {
              if (res.message === 'ExistAbonementsWithSupplements') {
                this.isExistAbonementsWithSupplements = true;
              } else {
                this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
              }
            },
          );
      }
      if (this.formProductSupplementsChanged) {
        this.updateProductSub = this.networkProductsService.addProductSupplements(
          this.formProductSupplements.get('supplements').value,
          this.product.id,
          this.isExistAbonementsWithSupplements,
        ).pipe(take(1), untilDestroyed(this)).subscribe(
          () => this.dialogRef.close(this.product.category_id),
          (res) => {
            if (res.message === 'ExistAbonementsWithSupplements') {
              this.isExistAbonementsWithSupplements = true;
            } else {
              this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
            }
          });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
