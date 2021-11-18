import { Injectable } from '@angular/core';
import { LocalStorage } from '../storages/interfaces/local-storage.interface';
import {
  AddToCartProductInterface,
  AddToCartProductSupplementInterface,
  ProductDataForBackendInterface,
  ProductSupplementInterface,
  ProductSupplementOptionsInterface,
} from '../helpers/products.helper';

@Injectable({providedIn: 'root'})
export class SelectedProductsService {
  selectedProducts: AddToCartProductInterface[] = [];

  constructor(
    private customLocalStorage: LocalStorage,
  ) {
    this.selectedProducts = JSON.parse(this.customLocalStorage.getItem('selected-products') || '[]');
  }

  initSelectedProduct(product: AddToCartProductInterface) {
    return {
      id: product.id,
      cartId: this.selectedProducts.length + 1,
      inaccessible: product.inaccessible,
      quantity: 1,
      bonus: +product.bonus,
      price: +product.price,
      name: product.name,
      capacity: product.capacity,
      description: product.description,
      img: product.img,
      supplements: [],
    } as AddToCartProductInterface;
  }

  addProductToCart(product: AddToCartProductInterface) {
    if (!product.inaccessible) {
      const productExist = this.selectedProducts.find((el) => el.cartId === product.cartId);
      if (productExist) {
        productExist.quantity++;
      } else {
        const productToCart = this.initSelectedProduct(product);
        this.selectedProducts = [productToCart, ...this.selectedProducts];
      }
      this.syncProductPriceAndBonuses();
      this.saveSelectedProducts();
    }
  }

  addProductToCartByInput(product: AddToCartProductInterface, event: any) {
    if (!product.inaccessible) {
      const value = event.target.value.replace(/\D+/g, '');
      const productExist = this.selectedProducts.find((el) => el.cartId === product.cartId);
      if (value && value > 0) {
        if (productExist) {
          productExist.quantity = +value;
        } else {
          const productToCart = this.initSelectedProduct(product);
          this.selectedProducts = [productToCart, ...this.selectedProducts];
        }
      } else {
        this.selectedProducts = this.selectedProducts.filter((el) => el.cartId !== product.cartId);
      }
      this.syncProductPriceAndBonuses();
      this.saveSelectedProducts();
    }
  }

  removeQuantityProductFromCart(product: AddToCartProductInterface) {
    const productExist = this.selectedProducts.find((el) => el.cartId === product.cartId);
    if (productExist.quantity !== 1) {
      productExist.quantity--;
      this.syncProductPriceAndBonuses();
      this.saveSelectedProducts();
    }
  }

  deleteProductFromCart(product: AddToCartProductInterface) {
    const productExist = this.selectedProducts.find((el) => el.cartId === product.cartId);
    if (productExist) {
      this.selectedProducts = this.selectedProducts.filter((el) => el.cartId !== product.cartId);
      this.syncProductPriceAndBonuses();
      this.saveSelectedProducts();
    }
  }

  getSelectedProducts(): AddToCartProductInterface[] {
    return this.selectedProducts;
  }

  getSelectedProductsCount() {
    return +this.selectedProducts.reduce((a, b) => a + +b.quantity, 0);
  }

  getProductCount(cartId: number): number {
    const productExist = this.selectedProducts.find((selectedProduct) => selectedProduct.cartId === cartId);
    return productExist ? productExist.quantity : 0;
  }

  getOrderActualPrice(): number {
    return this.selectedProducts.reduce((a, b) => {
      const supplementsPrice = b.supplements.reduce((supA, supB) => supA + (supB.price * supB.quantity), 0);
      return (a + (supplementsPrice * b.quantity) + (+b.price * b.quantity));
    }, 0);
  }

  getProductBonuses(): number {
    const oneHundred = 100;
    const maxSymbols = 2;
    return +this.selectedProducts.reduce((a, b) => {
      const supplementsBonuses =
        b.supplements.reduce((supA, supB) => supA + (Number(supB.bonus) * supB.quantity), 0);
      return (+a * oneHundred + (+b.bonus * b.quantity + supplementsBonuses * b.quantity)
        * oneHundred) / oneHundred;
    }, 0).toFixed(maxSymbols);
  }

  syncProductPriceAndBonuses(): void {
    this.getOrderActualPrice();
    this.getProductBonuses();
  }

  deleteSelectedProducts() {
    this.selectedProducts = [];
    this.saveSelectedProducts();
  }

  saveSelectedProducts(): void {
    this.customLocalStorage.setItem('selected-products', JSON.stringify(this.selectedProducts));
  }

  setSupplementOptionRequestBody(
    option: ProductSupplementOptionsInterface,
    supplement: ProductSupplementInterface,
  ): AddToCartProductSupplementInterface {
    return {
      id: option.id,
      name: option.name,
      price: option.price,
      quantity: 1,
      bonus: option.bonus,
      required: supplement.required,
      supplement_id: option.supplement_id,
    };
  }

  toggleProductSupplementOption(
    option: ProductSupplementOptionsInterface,
    supplement: ProductSupplementInterface,
    product: AddToCartProductInterface) {
    const foundProduct = this.selectedProducts.find((el) => el.cartId === product.cartId);
    if (foundProduct) {
      if (!this.isOptionDisabled(supplement, option.id, product.cartId)) {
        const optionIsExist = foundProduct.supplements.some((el) => el.id === option.id);
        if (optionIsExist) {
          foundProduct.supplements = foundProduct.supplements.filter((el) => el.id !== option.id);
        } else {
          const optionRequestBody = this.setSupplementOptionRequestBody(option, supplement);
          foundProduct.supplements = [optionRequestBody, ...foundProduct.supplements];
        }
      }
    } else {
      const productToCart = this.initSelectedProduct(product);
      const optionRequestBody = this.setSupplementOptionRequestBody(option, supplement);
      productToCart.supplements = [optionRequestBody];
      this.selectedProducts = [productToCart, ...this.selectedProducts];
    }
    this.syncProductPriceAndBonuses();
    this.saveSelectedProducts();
  }

  addSupplementOptionQuantity(
    option: ProductSupplementOptionsInterface,
    supplement: ProductSupplementInterface,
    product: AddToCartProductInterface,
  ) {
    const foundProduct = this.selectedProducts.find((el) => el.cartId === product.cartId);
    const maxOptions = supplement.max_options;
    const isCanBeAdded = maxOptions !== null
      ? this.getTotalNumberOptions(supplement.id, product.cartId) < maxOptions
      : true;
    if (isCanBeAdded && !this.isOptionDisabled(supplement, option.id, product.cartId)) {
      if (foundProduct) {
        const optionIsExist = foundProduct.supplements.find((el) => el.id === option.id);
        if (!!optionIsExist) {
          optionIsExist.quantity++;
        } else {
          const optionRequestBody = this.setSupplementOptionRequestBody(option, supplement);
          foundProduct.supplements = [optionRequestBody, ...foundProduct.supplements];
        }
        this.syncProductPriceAndBonuses();
        this.saveSelectedProducts();
      } else {
        const productToCart = this.initSelectedProduct(product);
        const optionRequestBody = this.setSupplementOptionRequestBody(option, supplement);
        productToCart.supplements = [optionRequestBody];
        this.selectedProducts = [productToCart, ...this.selectedProducts];
      }
    }
  }

  removeOptionQuantity(option: ProductSupplementOptionsInterface, supplementId: number, cartProductId: number) {
    const product = this.selectedProducts.find((el) => el.cartId === cartProductId);
    if (product) {
      const optionIsExist = product.supplements.find((el) => el.id === option.id);
      if (optionIsExist.quantity !== 1) {
        optionIsExist.quantity--;
      } else {
        product.supplements = product.supplements.filter((o) => o.id !== option.id);
      }
      this.syncProductPriceAndBonuses();
      this.saveSelectedProducts();
    }
  }

  isOptionDisabled(supplement: ProductSupplementInterface, optionId: number, cartProductId: number) {
    const product = this.selectedProducts.find((el) => el.cartId === cartProductId);
    if (product && product.supplements.length) {
      const selectedOptionsNumber = product.supplements.filter((o) => o.supplement_id === supplement.id).length;
      const maxOpts = supplement.max_options;
      if (maxOpts === null) {
        return false;
      }
      return (selectedOptionsNumber >= maxOpts || this.getTotalNumberOptions(supplement.id, cartProductId) === maxOpts)
        && !this.isOptionSelected(optionId, cartProductId);
    }
    return false;
  }

  isOptionSelected(optionId: number, cartProductId: number) {
    const product = this.selectedProducts.find((el) => el.cartId === cartProductId);
    if (product && product.supplements.length) {
      return product.supplements.some((option) => option.id === optionId);
    }
    return false;
  }

  getSelectedOption(optionId: number, cartProductId: number) {
    const product = this.selectedProducts.find((el) => el.cartId === cartProductId);
    if (product && product.supplements.length) {
      const foundOption = product.supplements.find((option) => option.id === optionId);
      if (foundOption) {
        return foundOption;
      } else {
        return {quantity: 0};
      }
    }
    return false;
  }

  getGroupSelectedOptions(supplementId: number, cartProductId: number) {
    const product = this.selectedProducts.find((el) => el.cartId === cartProductId);
    if (product && product.supplements.length) {
      return product.supplements.filter((o) => o.supplement_id === supplementId);
    }
    return [];
  }

  getTotalNumberOptions(supplementId: number, cartProductId: number) {
    return this.getGroupSelectedOptions(supplementId, cartProductId).reduce((a, b) => a + +b.quantity, 0);
  }

  getSomeSelectedProduct(cartProductId: number): AddToCartProductInterface {
    const product = this.selectedProducts.find((el) => el.cartId === cartProductId);
    return !!product ? product : null;
  }

  getFullPriceProduct(cartProductId: number): number {
    const productExist = this.selectedProducts.find((el) => el.cartId === cartProductId);
    if (productExist) {
      const productPrice = +this.getSomeSelectedProduct(cartProductId).price;
      const supplementsPrice = +this.getSomeSelectedProduct(cartProductId).supplements
        .reduce((a, b) => a + (b.price * b.quantity), 0);
      return (productPrice * this.getSomeSelectedProduct(cartProductId).quantity)
        + (supplementsPrice * this.getSomeSelectedProduct(cartProductId).quantity);
    } else {
      return null;
    }
  }

  addNewProductToCart(
    product: AddToCartProductInterface,
    supplements: ProductSupplementInterface[],
    productQuantity: number,
  ) {
    let supplementsWithOptions = [];
    supplements.forEach((supplement) => {
      const selectedOptions = supplement.options.filter((option) => {
        option['required'] = supplement.required;
        return option.quantity > 0;
      });
      supplementsWithOptions = [...selectedOptions, ...supplementsWithOptions];
    });
    const productToCart = this.initSelectedProduct(product);
    productToCart.quantity = productQuantity;
    productToCart.supplements = supplementsWithOptions;
    this.selectedProducts = [productToCart, ...this.selectedProducts];
    this.saveSelectedProducts();
  }

  initSelectedProducts() {
    const productsRequestBody = this.selectedProducts.map((product) => {
      const productSupplements = product.supplements.map((supplement) => {
        return {
          id: supplement.id,
          quantity: supplement.quantity,
        };
      });
      return {
        product_id: product.id,
        product_name: product.name,
        quantity: product.quantity,
        supplement_options: productSupplements !== null ? productSupplements : [],
      } as ProductDataForBackendInterface;
    });

    return {
      order: productsRequestBody,
    };
  }
}
