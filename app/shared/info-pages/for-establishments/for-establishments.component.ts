import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationRegistrationDialogComponent } from './application-registration-dialog/application-registration-dialog.component';
import { isPlatformBrowser } from '@angular/common';
import { LanguageDialogComponent } from '../../components/language-dialog/language-dialog.component';
import { take } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FLAGS_SPRITE } from '../../helpers/variables.helper';
import { LANGUAGES } from '../../helpers/translate.helper';
import { LanguageService } from '../../services/language.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { getBackendMessage } from '../../helpers/errors.helper';
import { LandingFormType, LandingService } from '../services/landing.service';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../../environments/environment';
import { SeoPageName } from '../../seo/models/page-name.enum';
import { PageMetaService } from '../../seo/graph-cms/page-meta/page-meta.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { trimLongText } from '../../helpers/helpers';

interface PostInterface {
  showFullDescription: boolean;
  imgUrl: string;
  title: string;
  description: string;
}

@UntilDestroy()
@Component({
  selector: 'for-establishments',
  templateUrl: './for-establishments.component.html',
  styleUrls: ['./for-establishments.component.scss'],
})
export class ForEstablishmentsComponent implements OnInit {
  error: string = '';
  sendMailSub = Subscription.EMPTY;
  flagsSpriteName = FLAGS_SPRITE;
  languages = LANGUAGES;
  flagIconName: string = '';
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    coffeeshop_name: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    typeForm: new FormControl(LandingFormType.mainCafe),
  });
  swiperConfig: SwiperConfigInterface = {
    init: true,
    centeredSlides: true,
    simulateTouch: true,
    allowTouchMove: true,
    slideToClickedSlide: true,
    autoplay: {
      delay: 15000,
    },
    pagination: {
      el: '.c-forEstablishmentsSwiper__pagination',
      type: 'fraction',
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      767: {
        slidesPerView: 2,
        spaceBetween: 50,
      },
    },
  };
  slides: PostInterface[] = [
    {
      showFullDescription: false,
      imgUrl: '/assets/img/landings/establishment-registration/posts/post-1.jpeg',
      title: marker('Пити каву тепер, зручніше та дешевше, разом з CoffeePhone ❤️'),
      description: marker(
        'Сервіс CoffeePhone дозволяє вашим відвідувачам робити зручні замовлення у ваших закладах та отримувати ' +
        ' бонуси. Кожне замовлення дорівнює абонементам, використовувати їх можна в будь-який момент. Користувачі ' +
        'можуть переглядати ваші заклади на карті та прокладати до них маршрут. Можуть дарувати придбані абонементи ' +
        'своїм друзям і використовувати багато інших можливостей.'),
    },
    {
      showFullDescription: false,
      imgUrl: '/assets/img/landings/establishment-registration/posts/post-2.jpeg',
      title: marker('Створіть безпечне QR-меню для вашої кав‘ярні 📱'),
      description: marker(
        'Отримайте безпечне, стильне меню для кав‘ярні, яке на 30% скорочує витрати і на 20-40% підвищує продажі. ' +
        'З якими проблемами стикаються власники кав‘ярень зі столиками? ' +
        '• Не якісне пдф меню або відсутність його. Занадто дрібний шрифт на екрані смартфона, не зручно вибирати ' +
        'продукцію: клієнти залишаються незадоволеними, продажі та середній чек падають. ' +
        '• Меню в друкованому вигляді - великі потенційні ризики як для вашої команди, так і для гостей. ' +
        'Ви забезпечите максимальну безпеку для гостей і почнете заробляти більше: краще продає за рахунок фото, ' +
        'інтерактиву та безконтактної оплати, також покупці отримують бонуси за кожне замовлення. Вище лояльність ' +
        'клієнтів, менше витрат на меню і персонал.' +
        '- QR-меню спрощує управління і знижує витрати\n' +
        '- На 20-40% зростає продаж і середній чек\n' +
        '- Не витрачаєте гроші на розробку власного сайту\n' +
        '- Гостям не потрібно завантажувати додаток - вони задоволені. ' +
        'Підключайтеся до CoffeePhone зараз і отримуйте готову сторінку через 48 годин.'),
    },
    {
      showFullDescription: false,
      imgUrl: '/assets/img/landings/establishment-registration/posts/post-3.jpeg',
      title: marker('Відвідувачі не можуть вас знайти? Не проблема. ☺️'),
      description: marker(
        'Додайте локації своїх закладів на карті. Користувачі зможуть переглянути локації ваших закладів та ' +
        'прокласти до них маршрут на карті за допомогою сервісу CoffeePhone. Скласти своє замовлення по дорозі до' +
        ' нього, провести безконтактну оплату та отримати за кожне замовлення бонуси. Невже саме цього хоче кожен' +
        ' ваш відвідувач? Переглядайте оздоблення закладів, виберіть який сподобався ' +
        'і прокладіть маршрут до нього на карті.'),
    },
    {
      showFullDescription: false,
      imgUrl: '/assets/img/landings/establishment-registration/posts/post-4.jpeg',
      title: marker('Підключіть бонусну програму 😋'),
      description: marker(
        'Кав\'ярні, в яких реалізується бонусна програма покупців, відчувають значне зростання продажів.' +
        ' 80% відсотків клієнтів стверджують, що вони частіше купують у компанії, яка пропонує бонуси для своїх' +
        ' постійних клієнтів. Крім того, 55% відвідувачів стверджують, що поділяться інформацією про таку компанію' +
        ' зі своїми друзями. Платформа Coffeephone це спеціального додаток, який надає власникам кав’ярень набагато' +
        ' більше інформації, ніж фізичні карти, пластикові або паперові носії. Відомості про те, як часто певний' +
        ' клієнт здійснює покупки, скільки вони зазвичай витрачають і які продукти вони вважають кращими,' +
        ' дозволяють продавцям кави персоналізувати пропозиції і надавати більш індивідуальні послуги.' +
        ' Програми лояльності, побудовані такій основі, щоб збільшувати доходи від кожного конкретного клієнта,' +
        ' оскільки вони дають покупцям більше мотивації для покупки своїх улюблених продуктів.'),
    },
    {
      showFullDescription: false,
      imgUrl: '/assets/img/landings/establishment-registration/posts/post-6.jpeg',
      title: marker('Отримайте розгорнутий звіт вашого бізнесу. 🚀'),
      description: marker('Коефіцієнт рентабельності продажів допомагає зрозуміти, наскільки вигідним' +
        ' є реалізація конкретного товару.\n' +
        '\n' +
        'У звіті Coffeephone | Business можна відслідкувати, які товари продаються найбільше, в яких закладах ' +
        'найбільше виданих товарів, скільки товарів придбали як абонемент і скільки таких абонементів було списано.\n' +
        '\n' +
        'Отримуйте звіт за будь-який день, зрівнюйте ваші прибутки.\n' +
        '\n' +
        'Що ви отримаєте:\n' +
        '- Візуалізація даних: ви швидко та легко побачите, як розвивається ваш бізнес.\n' +
        '- Правильно підібраний контекст: з першого погляду відомо, що йдеться у діаграмах і які дані представлені.\n' +
        '- Можливість вибирати певні дати.\n' +
        '- Дозволяє порівнювати вибрані показники з попереднім періодом, щоб оцінювати ефективність закладів.\n' +
        '- Дозволяє з потрібною вам частотою відстежувати зміни, наприклад, просідання продаж ' +
        '(раз на добу, на тиждень, в реальному часі).\n' +
        '\n' +
        'Підключайтесь саме зараз і отримуйте бонусні кошти на баланс Coffeephone | Business'),
    },
    {
      showFullDescription: false,
      imgUrl: '/assets/img/landings/establishment-registration/posts/post-5.jpeg',
      title: marker('Випити каву разом навіть, якщо відвідувачі з різних міст, тепер можливо!😊\n'),
      description: marker(
        'За допомогою CoffeePhone можна подарувати будь-яку кількість різних абонементів на продукцію в кав\'ярнях.\n' +
        '\n' +
        'Якщо ви хочете зробити приємно своєму другу і не знаєте як? 🤔\n' +
        'Подаруйте йому абонементи.\n' +
        '\n' +
        'Ніхто не відмовиться від кружечки запашної кави зранку та кусочок смачного чизкейка' +
        ' подарованого від свого друга, навіть якщо він з іншого міста.\n' +
        '\n' +
        'Безліч можливостей:\n' +
        '- Зробіть приємно своїй другій половинці, якщо вона далеко від вас.❤️\n' +
        '- Винні своєму другу каву, просто подаруйте йому абонемент в будь-якій кав\'ярні.😉\n' +
        '- Не маєте можливості пригостити маму/бабусю смачненьким,' +
        ' виберіть заклад який є в їхньому місті та подаруйте абонементи на будь-яку продукцію.🎉\n' +
        '\n' +
        'З CoffeePhone кавові мрії стають реальністю. Підключайтесь зараз і отримуйте безліч нових можливостей😍'),
    },
  ];
  SITE_URL = environment.SITE_URL;
  maxWordsForDescr: number = 150;
  constructor(
    private dialog: MatDialog,
    private title: Title,
    private meta: Meta,
    private translate: TranslateService,
    private languageService: LanguageService,
    private landingService: LandingService,
    private notifier: NotifierService,
    private pageMetaService: PageMetaService,
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  ngOnInit(): void {
    this.setCurrentLanguage();
    this.pageMetaService.initTags(SeoPageName.WelcomePartnersPage);
  }

  trimLongText(txt: string, showFullDescription: boolean) {
    return this.translate.instant(trimLongText(txt, this.maxWordsForDescr, showFullDescription));
  }

  showMore(index: number) {
    this.slides[index].showFullDescription = !this.slides[index].showFullDescription;
  }

  openRegistrationDialog() {
    this.dialog.open(ApplicationRegistrationDialogComponent);
  }

  setCurrentLanguage() {
    this.languageService.currentLanguage$
      .pipe(untilDestroyed(this))
      .subscribe((language) => {
        this.flagIconName = this.languages[language].flagIconName;
      });
  }

  isPwaApp(): boolean {
    if (isPlatformBrowser(this.platform)) {
      return (window.matchMedia('(display-mode: standalone)').matches)
        || ('standalone' in window.navigator)
        && (window.navigator['standalone'])
        || document.referrer.includes('android-app://');
    } else {
      return false;
    }
  }

  openLocalizationDialog() {
    this.dialog.open(LanguageDialogComponent);
  }

  sendMail() {
    if (this.form.valid) {
      this.sendMailSub = this.landingService.sendMail(this.form.value)
        .pipe(take(1), untilDestroyed(this))
        .subscribe(() => {
            this.notifier.notify('success', this.translate.instant(
              marker('Ваше повідомлення успішно надіслане. Очікуйте на відповідь'),
            ));
            this.form.reset();
          },
          (res) => {
            this.error = getBackendMessage(res.message);
          });
    }
  }
}
