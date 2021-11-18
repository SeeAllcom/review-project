import { AbstractStorage } from './abstract-storage.interface';
import { Injectable } from '@angular/core';

/**
 * Session Storage
 *
 * @see https://developer.mozilla.org/ru/docs/Web/API/Window/sessionStorage
 */
@Injectable()
export abstract class SessionStorage extends AbstractStorage {}
