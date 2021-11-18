import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable()
@Pipe({name: 'search'})
export class SearchPipe implements PipeTransform {
  transform(elements: any[], value: string, searchEl: string = 'name') {
    return !value ? elements : elements.filter((el: any) =>
      el[searchEl].toLowerCase().includes(value.toString().toLowerCase()));
  }
}
