import { AbstractStorage } from './abstract-storage.interface';
import { Injectable } from '@angular/core';

/**
 * Memory Storage
 *
 * @description
 * It simple storage for emulate Web Storage API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
 */
@Injectable()
export abstract class MemoryStorage extends AbstractStorage {}
