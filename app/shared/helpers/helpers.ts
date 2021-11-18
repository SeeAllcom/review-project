export const MIN_BONUSES_PERCENTAGE: number = 2;
export const ONLINE_PAYMENT_COMMISSION: number = 2.7;

export function convertTranslateDictionary(s) {
  return Object.keys(s).reduce((prev, next) => Object.assign(prev, s[next]), {});
}

export function arrayWithoutArgs(arr: any[], ...args) {
  return arr.filter((v) => !args.includes(v));
}

export function deepFlatten<T extends any>(arr): T[] {
  return [].concat(...arr.map((v) => (Array.isArray(v) ? deepFlatten(v) : v)));
}

export function flattenObject(source, delimiter?, filter?) {
  const result = {};
  (function flat(obj, stack) {
    Object.keys(obj).forEach((k) => {
      const s = stack.concat([k]);
      const v = obj[k];
      if (filter && filter(k, v)) { return; }
      if (typeof v === 'object') { flat(v, s); } else { result[s.join(delimiter)] = v; }
    });
  })(source, []);
  return result;
}

export function returnUniqueElementsInArray<T>(arr: T[]): T[] {
  return Array.from(new Set<T>(arr));
}

export function objectMap<T>(object: T, mapFn): T {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(key);
    return result;
  }, {}) as T;
}

export function isNumber(str) {
  return str.toLowerCase() === str.toUpperCase();
}

export function trimLongText(txt: string, maxWords: number, showFullDescription: boolean = false) {
  return !showFullDescription && txt ? (txt.length > maxWords ? txt.slice(0, maxWords) + '...' : txt) : txt;
}
