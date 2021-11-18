import { Inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';
import { IMetaObj } from '../models/meta.model';
import {
  arrayWithoutArgs,
  deepFlatten,
  flattenObject,
  objectMap,
  returnUniqueElementsInArray,
} from '../../../helpers/helpers';
import { isPlatformBrowser } from '@angular/common';

export const TEMPLATE_VARIABLE_WITH_BRACKETS = /{([\/^\S*${}]*)}/g;

@Injectable({providedIn: 'root'})
export class GraphCmsTemplateParserService {

  constructor(
    @Inject(PLATFORM_ID) private platform: any,
  ) { }

  replaceDynamicTags(rawMeta: IMetaObj, options: {}): IMetaObj {
    this.validateOptions(rawMeta, options);
    return objectMap(rawMeta, (key) => this.replaceMeta(rawMeta, options, key));
  }

  validateOptions(meta: IMetaObj, options?: {}) {
    if (isDevMode() && options) {
      this.checkAllOptionsInclude(this.getAllVariableNames(meta), options);
    }
  }

  private replaceMeta<Key extends keyof IMetaObj>(metaObj: IMetaObj, options: {}, type: Key) {
    const meta = metaObj[type] || '';
    const jsonSeparator = ' '; // space is a separator to prevent collision with templates {}
    const rawMeta = JSON.stringify(meta, null, jsonSeparator);
    const dynamicMeta = rawMeta.replace(
      TEMPLATE_VARIABLE_WITH_BRACKETS,
      (p1, p2) => this.escapeSpecialChars(options[p2]),
    );
    try {
      return JSON.parse(dynamicMeta);
    } catch {
      if (!isPlatformBrowser(this.platform)) {
        throw Error(`Error with graphCMS data: ${dynamicMeta}`);
      }
    }
  }

  private getAllVariableNames(metaObj: IMetaObj): string[] {
    const metaValues = Object.values(flattenObject(metaObj));
    const rawMetaValues = metaValues.map((v) => v ? JSON.stringify(v) : '');
    const variablesInValues = rawMetaValues.map((v) => v.match(TEMPLATE_VARIABLE_WITH_BRACKETS));
    const preparedVariables = deepFlatten<string>(variablesInValues)
      .filter((v) => !!v)
      .map(this.removeCurlyBrackets);
    return returnUniqueElementsInArray(preparedVariables);
  }

  private checkAllOptionsInclude(variableNames: string[], options: {}) {
    const missingOptions = arrayWithoutArgs(variableNames, ...Object.keys(options)).filter((meta) => meta !== null);

    const isAllOptionsInclude = missingOptions.length === 0;

    if (!isAllOptionsInclude) {
      // tslint:disable-next-line:no-console
      console.error(`You dont include all option(s): ${missingOptions}`);
    }
  }

  private removeCurlyBrackets(variable) {
    return variable.slice(1, -1);
  }

  private escapeSpecialChars(rawJSON: string): string {
    return typeof rawJSON === 'string' ?
      rawJSON.replace(/\\([\s\S])|(")/g, '\\$1$2').replace(/\n|\t/g, ' ') :
      rawJSON;
  }
}
