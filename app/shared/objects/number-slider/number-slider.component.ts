import {
  Component,
  EventEmitter,
  Input, OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'number-slider',
  templateUrl: './number-slider.component.html',
  styleUrls: ['./number-slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NumberSliderComponent implements OnChanges {
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() max: number;
  @Input() min: number;
  @Input() control: AbstractControl = new FormControl();
  @Output() value = new EventEmitter<number>();

  constructor() { }

  ngOnChanges(changes): void {
    this.value.emit(changes.max.currentValue);
  }
}
