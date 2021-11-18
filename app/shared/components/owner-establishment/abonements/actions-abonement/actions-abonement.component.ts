import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesInterface, ProductInterface } from '../../../../helpers/products.helper';
import { environment } from '../../../../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbonementStatus, NetworkAbonementResponse } from '../../helpers/network-abonements.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NetworkProductsService } from '../../../../services/owner/network-products.service';
import { getLocalizationCategoriesKey } from '../../helpers/network.helper';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { getBackendMessage } from '../../../../helpers/errors.helper';
import { NetworkAbonementsService } from '../../../../services/owner/network-abonements.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

interface DialogData {
  abonement: NetworkAbonementResponse;
  status: AbonementStatus;
}

@UntilDestroy()
@Component({
  selector: 'actions-abonement',
  templateUrl: './actions-abonement.component.html',
  styleUrls: ['./actions-abonement.component.scss'],
})
export class ActionsAbonementComponent implements OnInit {
  readonly AbonementStatus = AbonementStatus;
  products: ProductInterface[] = [];
  getProductsSub = Subscription.EMPTY;
  sendSub = Subscription.EMPTY;
  categoryId: number;
  categories: CategoriesInterface[] = [];
  searchValue: string = '';
  API_URL = environment.API_URL;
  minDate = new Date();
  selectedProduct: ProductInterface;
  isAddAbonementTemplate: boolean = false;
  form: FormGroup = new FormGroup({
    quantity: new FormControl(1, [Validators.required]),
    price: new FormControl('', [Validators.required]),
    date_start: new FormControl('', [Validators.required]),
    date_end: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  notValidFormMsg = marker('Перевірте правильність введеня даних');

  constructor(
    private networkProductsService: NetworkProductsService,
    private networkAbonementsService: NetworkAbonementsService,
    private notifier: NotifierService,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<ActionsAbonementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  ngOnInit(): void {
    if (this.data && this.data.abonement) {
      this.setAbonementValueToForm();
    } else {
      this.form.setControl(
        'product_id',
        new FormControl(this.data ? this.data.abonement.product.id : '', [Validators.required]));
      this.isAddAbonementTemplate = true;
      this.getCategoriesWithProduct();
    }
  }

  addAbonement() {
    if (this.form.valid) {
      this.sendSub = this.networkAbonementsService.addAbonement(this.form.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.notifier.notify('warning', this.translate.instant(this.notValidFormMsg));
    }
  }

  editAbonement() {
    if (this.form.valid) {
      this.sendSub = this.networkAbonementsService.editAbonement(this.form.value, this.data.abonement.id)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => this.dialogRef.close(true));
    } else {
      this.notifier.notify('warning', this.translate.instant(this.notValidFormMsg));
    }
  }

  selectProduct(product: ProductInterface) {
    this.selectedProduct = product;
  }

  setAbonementValueToForm() {
    this.form.patchValue({
      quantity: this.data.abonement.quantity,
      price: this.data.abonement.price,
      description: this.data.abonement.description,
      date_start: this.data.abonement.date_start,
      date_end: this.data.abonement.date_end,
    });
  }

  // tslint:disable-next-line:cyclomatic-complexity
  getAbonementMaxPrice() {
    const saleForAbonement = 10;
    const oneHundred = 100;
    const quantityFormValue = this.form.get('quantity').value;
    if (this.data && this.data.abonement) {
      const oneProductPrice = (this.data.abonement.price / oneHundred) * saleForAbonement;
      return quantityFormValue !== 1 ? Math.floor(oneProductPrice * quantityFormValue) : oneProductPrice;
    }
    if (this.selectedProduct && this.selectedProduct.price) {
      const allQuantityProductPrice = this.selectedProduct.price * quantityFormValue;
      const sale = (allQuantityProductPrice / oneHundred * saleForAbonement);
      return quantityFormValue !== 1 ? Math.floor(allQuantityProductPrice - sale) : allQuantityProductPrice;
    }
    return 0;
  }

  send() {
    this.isAddAbonementTemplate ? this.addAbonement() : this.editAbonement();
  }

  getCategoryName(name: string) {
    return getLocalizationCategoriesKey(name);
  }

  getCategoriesWithProduct(id?: number) {
    this.getProductsSub = this.networkProductsService.getCategoriesWithProduct()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((productsData) => {
          this.categories = productsData.categories;
          if (id) {
            this.categoryId = id;
            this.getProductsByCategory(id);
          } else {
            this.products = productsData.products;
            this.categoryId = productsData.categories[0].id;
          }
        }, (res) => {
          this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
        },
      );
  }

  getProductsByCategory(categoryId: number) {
    this.getProductsSub = this.networkProductsService.getProductsByCategory(categoryId)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((res) => {
        this.products = res.products;
        this.resetFormValue();
      }, (res) => {
        this.notifier.notify('error', this.translate.instant(getBackendMessage(res.message)));
      });
  }

  private resetFormValue() {
    this.form.reset();
    this.form.get('quantity').patchValue(1);
    this.selectedProduct = null;
  }
}
