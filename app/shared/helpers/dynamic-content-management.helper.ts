import { NETWORK_MAIN_ROUTE } from '../components/owner-establishment/helpers/network.helper';
import { StandaloneAppModulesBasePathsEnum } from '../services/user-store.service';
import { LinkDefinition } from '../seo/html-tags/link.service';

export const DEFAULT_FAVICON = 'assets/img/favicon.png';

export type DynamicContentConfigInterface = {
  [x in string]: {
    favIcon: string;
    pwaIcons: LinkDefinition[];
    startupImages: LinkDefinition[];
  };
};

export const DYNAMIC_CONTENT_CONFIG: DynamicContentConfigInterface = {
  [NETWORK_MAIN_ROUTE]: {
    favIcon: 'assets/img/favicon-business-v2.png',
    pwaIcons: [
      {
        href: 'assets/icons/network/icon-57x57.png',
        rel: 'apple-touch-icon',
        sizes: '57x57',
      },
      {
        href: 'assets/icons/network/icon-60x60.png',
        rel: 'apple-touch-icon',
        sizes: '60x60',
      },
      {
        href: 'assets/icons/network/icon-72x72.png',
        rel: 'apple-touch-icon',
        sizes: '72x72',
      },
      {
        href: 'assets/icons/network/icon-76x76.png',
        rel: 'apple-touch-icon',
        sizes: '76x76',
      },
      {
        href: 'assets/icons/network/icon-96x96.png',
        rel: 'apple-touch-icon',
        sizes: '96x96',
      },
      {
        href: 'assets/icons/network/icon-114x114.png',
        rel: 'apple-touch-icon',
        sizes: '114x114',
      },
      {
        href: 'assets/icons/network/icon-120x120.png',
        rel: 'apple-touch-icon',
        sizes: '120x120',
      },
      {
        href: 'assets/icons/network/icon-128x128.png',
        rel: 'apple-touch-icon',
        sizes: '128x128',
      },
      {
        href: 'assets/icons/network/icon-144x144.png',
        rel: 'apple-touch-icon',
        sizes: '144x144',
      },
      {
        href: 'assets/icons/network/icon-152x152.png',
        rel: 'apple-touch-icon',
        sizes: '152x152',
      },
      {
        href: 'assets/icons/network/icon-180x180.png',
        rel: 'apple-touch-icon',
        sizes: '180x180',
      },
      {
        href: 'assets/icons/network/icon-192x192.png',
        rel: 'apple-touch-icon',
        sizes: '192x192',
      },
      {
        href: 'assets/icons/network/icon-384x384.png',
        rel: 'apple-touch-icon',
        sizes: '384x384',
      },
      {
        href: 'assets/icons/network/icon-512x512.png',
        rel: 'apple-touch-icon',
        sizes: '512x512',
      },
    ],
    startupImages: [
      {
        href: 'assets/blm-v2/network/apple-splash-2048-2732.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2732-2048.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1668-2388.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2388-1668.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1536-2048.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2048-1536.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1668-2224.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2224-1668.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1620-2160.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2160-1620.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1284-2778.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2778-1284.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1170-2532.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2532-1170.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1125-2436.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2436-1125.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1242-2688.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2688-1242.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-828-1792.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1792-828.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1242-2208.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-2208-1242.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-750-1334.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1334-750.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-640-1136.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/network/apple-splash-1136-640.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
    ],
  },
  [StandaloneAppModulesBasePathsEnum.CoffeePhoneUser]: {
    favIcon: DEFAULT_FAVICON,
    pwaIcons: [
      {
        href: 'assets/icons/icon-57x57.png',
        rel: 'apple-touch-icon',
        sizes: '57x57',
      },
      {
        href: 'assets/icons/icon-60x60.png',
        rel: 'apple-touch-icon',
        sizes: '60x60',
      },
      {
        href: 'assets/icons/icon-72x72.png',
        rel: 'apple-touch-icon',
        sizes: '72x72',
      },
      {
        href: 'assets/icons/icon-76x76.png',
        rel: 'apple-touch-icon',
        sizes: '76x76',
      },
      {
        href: 'assets/icons/icon-96x96.png',
        rel: 'apple-touch-icon',
        sizes: '96x96',
      },
      {
        href: 'assets/icons/icon-114x114.png',
        rel: 'apple-touch-icon',
        sizes: '114x114',
      },
      {
        href: 'assets/icons/icon-120x120.png',
        rel: 'apple-touch-icon',
        sizes: '120x120',
      },
      {
        href: 'assets/icons/icon-128x128.png',
        rel: 'apple-touch-icon',
        sizes: '128x128',
      },
      {
        href: 'assets/icons/icon-144x144.png',
        rel: 'apple-touch-icon',
        sizes: '144x144',
      },
      {
        href: 'assets/icons/icon-152x152.png',
        rel: 'apple-touch-icon',
        sizes: '152x152',
      },
      {
        href: 'assets/icons/icon-180x180.png',
        rel: 'apple-touch-icon',
        sizes: '180x180',
      },
      {
        href: 'assets/icons/icon-192x192.png',
        rel: 'apple-touch-icon',
        sizes: '192x192',
      },
      {
        href: 'assets/icons/icon-384x384.png',
        rel: 'apple-touch-icon',
        sizes: '384x384',
      },
      {
        href: 'assets/icons/icon-512x512.png',
        rel: 'apple-touch-icon',
        sizes: '512x512',
      },
    ],
    startupImages: [
      {
        href: 'assets/blm-v2/apple-splash-2048-2732.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2732-2048.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1668-2388.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2388-1668.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1536-2048.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2048-1536.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1668-2224.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2224-1668.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1620-2160.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2160-1620.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1284-2778.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2778-1284.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1170-2532.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2532-1170.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1125-2436.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2436-1125.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1242-2688.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2688-1242.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-828-1792.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1792-828.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1242-2208.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-2208-1242.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-750-1334.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1334-750.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
      {
        href: 'assets/blm-v2/apple-splash-640-1136.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: portrait)',
      },
      {
        href: 'assets/blm-v2/apple-splash-1136-640.jpg',
        rel: 'apple-touch-startup-image',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and' +
          ' (orientation: landscape)',
      },
    ],
  },
// tslint:disable-next-line:max-file-line-count
};
