import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { searchValue$ } from './search-input.helper';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, OnDestroy {
  searchValue$ = searchValue$;

  @HostListener('document:click', ['$event'])
  click(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.searchShown = false;
    }
  }

  @Input() isFixed: boolean = false;
  @Input() placeholder: string = '';
  searchShown: boolean = false;

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    searchValue$.next('');
  }

  checkValue(value: any): void {
    !value.length ? searchValue$.next('') : searchValue$.next(value);
  }

  getValue(value: any) {
    searchValue$.next(value);
  }
}
