import { AbstractStorage } from './abstract-storage.interface';
import { Injectable } from '@angular/core';

/**
 * Local Storage
 *
 * @see https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage
 */
@Injectable()
export abstract class LocalStorage extends AbstractStorage {}
