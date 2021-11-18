import { PoBrowserLoader } from './po-loaders/po-browser-loader';

export function translateLoaderFactory() {
  return new PoBrowserLoader();
}
