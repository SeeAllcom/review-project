import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { getBackendMessage } from '../helpers/errors.helper';

@Injectable()
@Pipe({name: 'getBackendMessage'})
export class GetBackendMessagePipe implements PipeTransform {
  transform(value: string) {
    return getBackendMessage(value);
  }
}
