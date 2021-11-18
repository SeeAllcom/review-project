import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BehaviorSubject } from 'rxjs';
import { AbonementInterface, AbonementSupplementInterface } from './abonements.helper';

export enum ProductOperationTypeEnum {
  Add = 'add',
  Edit = 'edit',
}

export enum ProductsTemplate {
  ProductsTemplate = 'ProductsTemplate',
  AbonementsTemplate = 'AbonementsTemplate',
  ErrorTemplate = 'ErrorTemplate',
  NetworkLoading = 'NetworkLoading',
}

export enum ShoppingCartEnum {
  MyAbonements = 'MyAbonements',
  AbonementsTemplate = 'AbonementsTemplate',
  ProductsTemplate = 'ProductsTemplate',
}

export const needUpdateProducts$ = new BehaviorSubject<boolean>(false);

export interface ProductObjectInterface {
  products: ProductInterface[];
}

export interface SubstituteProducts {
  substitute_products: SubstituteCategories[];
}

export interface SubstituteCategories {
  id: number;
  img: string;
  name: string;
  products: ProductInterface[];
}

export interface ProductDataForBackendInterface {
  product_id: number;
  product_name: string;
  quantity: number;
  supplement_options: AddToCartProductSupplementInterface[];
}

export interface OrderDataPaymentResponse {
  checkout_url: string;
  payment_id: string;
  response_status: string;
  error_message: string;
}

export interface OrderDataPayment {
  response: OrderDataPaymentResponse;
}

export interface ProductsWithCountInterface {
  order: ProductDataForBackendInterface[];
  dataPayment?: OrderDataPayment;
  message?: string;
}

export interface SuccessOrderResponse {
  order: {
    created_at: string;
    data: AbonementInterface[];
    id: number;
    price_ad: number;
    price: number;
    bonus: number;
    updated_at: string;
  };
  abonements: AbonementInterface[];
}

export interface ProductCapacityInterface {
  size: number;
  unit: string;
}

export interface ProductInterface {
  capacity: ProductCapacityInterface;
  hide: boolean;
  inaccessible: boolean;
  created_at?: string;
  category_id?: number;
  description: string;
  quantity: number;
  id: number;
  img: any;
  name: string;
  product_removal?: boolean;
  can_purchase_as_abonement?: boolean;
  product_removal_date?: string;
  price_ad?: number;
  price: number;
  bonus: number;
  updated_at?: string;
  created_product?: {
    category_id: number;
    id: number;
  };
  supplements: ProductSupplementInterface[];
}

export interface AddToCartProductInterface {
  id: number;
  cartId: number;
  inaccessible: boolean;
  quantity: number;
  bonus: number;
  price: number;
  name: string;
  capacity: ProductCapacityInterface;
  description: string;
  img: any;
  supplements: AddToCartProductSupplementInterface[];
}

export interface ProductSupplementsInterface {
  supplements: ProductSupplementInterface[];
}

export interface ProductSupplementInterface {
  id?: number;
  name: string;
  required: boolean;
  choice_only_one: boolean;
  max_options: number;
  options: ProductSupplementOptionsInterface[];
}

export interface ProductSupplementOptionsInterface {
  id?: number;
  name: string;
  price: number;
  bonus: string;
  product_id: number;
  quantity?: number;
  supplement_id: number;
}

export interface AddToCartProductSupplementInterface {
  id: number;
  quantity: number;
  required: boolean;
  name: string;
  price: number;
  bonus?: string;
  supplement_id?: number;
}

export interface CategoriesAndProductsInterface {
  categories: CategoriesInterface[];
  products: ProductInterface[];
}

export interface AllCategoriesInterface {
  categories: CategoriesInterface[];
}

export interface CategoriesInterface {
  id: number;
  name: string;
  img?: string;
  products?: ProductInterface[];
}

export interface CapacityInterface {
  id: string;
  unit: string;
}

export const ProductCapacityData: CapacityInterface[] = [
  {
    id: 'ml',
    unit: 'Мл',
  },
  {
    id: 'g',
    unit: 'Г',
  },
  {
    id: 'L',
    unit: 'Л',
  },
];

export const NETWORK_ESTABLISHMENTS: SwiperConfigInterface = {
  init: true,
  slidesPerView: 1,
  spaceBetween: 0,
  simulateTouch: true,
  allowTouchMove: true,
  autoplay: {
    delay: 3200,
  },
  pagination: {
    el: '.c-productsSwiper__pagination',
    type: 'progressbar',
  },
};
