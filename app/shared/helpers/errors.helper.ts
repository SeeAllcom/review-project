import { BehaviorSubject } from 'rxjs';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export const exchangeCodeMessageError: any = {
  'ConfirmYourEmail': marker('Будь ласка, підтвердіть свою електронну пошту для того щоб увійти.'),
  'CannotSignWithTheseCredentials': marker('Ви ввели невірний email або пароль,' +
    ' будь ласка, спробуйте ще раз, або відновіть пароль.'),
  'emailAlreadyExists': marker('Цей email вже існує, будь ласка, введіть інший.'),
  'AccountVerified':
    marker('Ваш аккаунт підтверджений, тепер ви можете увійти до свого облікового запису. Дякуємо, що ви з нами.'),
  'DataNotUpdated': marker('Стався збій з оновленням даних. Перезавантажте, будь ласка, сторінку. '),
  'TokenDoesNotExist': marker('Такий токен не існує.'),
  'NetworkAdded': marker('Ваша мережа успішно створена, далі можете наповнювати вітрину товарами.'),
  'avatarIsRequired': marker('Зображення є обов\'язкове.'),
  'nameIsRequired': marker('Ім\'я є обов\'язковим.'),
  'NetworkUpdated': marker('Дані вашої мережі(закладу) успішно оновлені.'),
  'Unauthenticated.': marker('Ваша сесія авторизації закінчилася, будь ласка,' +
    ' авторизуйтесь знову або перезагрузіть сторінку.'),
  'NotValidToken': marker('Ваша сесія авторизації закінчилася, будь ласка, авторизуйтесь знову.'),
  'SuccessfullyRegisteredGoToEmailConfirm': marker('Ви успішно зареєструвалися, для того щоб увійти ми відправили' +
    ' вам лист на вашу пошту, підтвердіть свій аккаунт.'),
  'imgSizeIsBig': marker('Розмір зображення перевищує 5000 кілобайт, виберіть зображення меншого розміру.'),
  'imgMustBeFileOfTypeImage': marker('Файл для зображення повинен бути файлом типу зображення.'),
  'avatarMustBeFileOfTypeImage': marker('Файл для зображення повинен бути файлом типу зображення.'),
  'shopOpenedAbonements': marker('Кав\'ярня дістала ваші абонементи.'),
  'SomethingWentWrong': marker('Щось пішло не так, спробуйте пізніше або перезавантажте сторінку.'),
  'AbonementHasAlreadyBeenUsed': marker('Абонемент(и) вже був використаний.'),
  'QuantityLimitExceeded': marker('Кількість надісланих абонементів перевищує ліміт.'),
  'LinkOutDate': marker('Протяжність дії відправленого повідомлення на вашу електронну пошту вичерпана.'),
  'IncorrectPassword': marker('Пароль повинен містити щонайменше 8 символів, ' +
    '1 велику та 1 малу символи, та принаймні 1 цифру.'),
  'PasswordDoesNotMatch': marker('Пароль не збігається.'),
  'noRegion': marker('Такого міста не знайдено, або його ще немає на CoffeePhone'),
  'NotTrueOldPassword': marker('Невірний старий пароль.'),
  'UserDoesNotExists': marker('Такого користувача не існує.'),
  'YouCannotGiveYourself': marker('Ви не можете подарувати абонемент(и) собі.'),
  'MessageNotSent': marker('Повідомлення не надіслано. Перезагрузіть сторінку або спробуйте пізніше.'),
  'NetworkDoesNotExists': marker('Спочатку зареєструйте мережу(заклад) в налаштуваннях,' +
    ' для того щоб користуватися CoffeePhone.'),
  'ExistAbonements': marker('В користувачів є невикористані абонементи. Після підтвердження видалення даного ' +
    'товару, користувачам нарахуються бонусні кошти в тому розмірі, в якому вони зробили оплату раніше'),
  'ExistAbonementsWithSupplements': marker('В користувачів є невикористані абонементи з добавками, які ви ' +
    'намагаєтесь видалити. Після підтвердження видалення цих добавок, користувачам нарахуються бонусні кошти в тому ' +
    'розмірі, в якому вони зробили оплату раніше'),
  'ProductDoesNotExists': marker('Не можливо зробити замовлення, такого товару не існує.'),
  'AbonementDoesNotExist': marker('Таких абонементів не існує.'),
  'InsufficientQuantityAbonements': marker('Вибрана не вірна кількість абонементів, ми оновили ваш інвентар.' +
    ' Складіть своє замовлення ще раз.'),
  'ProductExistsButCannotBePurchased': marker('Товар(и) недоступні для купівлі.'),
  'ProductsInBasketFromSeveralNetworks': marker('В корзині присутні товари з різних мереж'),
  'ProductsCannotPurchasedBecausePaymentDataNotFilled': marker('Не можливо придбати,' +
    ' в закладі не заповнені платіжні дані.'),
  'PaymentSystemDataIncorrect': marker('Невірно вказані дані вашого рахунку для отримання коштів'),
  'InsufficientNumberBonuses': marker('Недостатня кількість бонусів для оплати'),
  'MailAboutAbonementsGiftNotSend': marker('Подарунок надісланий, але ми не змогли повідомити' +
    ' вашого друга про нього, сповістіть його самостійно'),
  'FriendAlreadyAdded': marker('Не можливо додати. Даний друг існує у списку ваших друзів'),
  'TheOrderIsSpoiled': marker('Замовлення недійсне'),
  'AccessIsDenied': marker('В доступі відмовлено'),
  'PaymentTermExpired': marker('Термін оплати замовлення вичерпано.'),
  'PageNotFound': marker('Такої сторінки не знайдено.'),
};

export function getBackendMessage(code: string): string {
  return exchangeCodeMessageError[code]
    || marker('Щось пішло не так, спробуйте пізніше або перезавантажте сторінку.');
}

export const UnauthenticatedError$ = new BehaviorSubject<string>('');
