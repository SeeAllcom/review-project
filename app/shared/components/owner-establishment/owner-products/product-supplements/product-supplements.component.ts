import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductSupplementInterface, ProductSupplementOptionsInterface } from '../../../../helpers/products.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'product-supplements',
  templateUrl: './product-supplements.component.html',
  styleUrls: ['./product-supplements.component.scss'],
})
export class ProductSupplementsComponent implements OnInit {
  formProductSupplements = this.formBuilder.group({
    supplements: this.formBuilder.array([]),
  });

  @Input() notificationsShown: boolean = true;
  @Input() supplementsData: ProductSupplementInterface[] = [];
  @Output() supplementsValue = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (this.supplementsData.length) {
      this.setSupplements();
    }
    this.formProductSupplements.valueChanges.pipe(untilDestroyed(this))
      .subscribe(() => this.supplementsValue.emit(this.formProductSupplements));
  }

  setSupplements() {
    const control = this.formProductSupplements.controls['supplements'] as FormArray;
    this.supplementsData.forEach((supplement) => {
      control.push(this.formBuilder.group({
          id: supplement.id,
          name: new FormControl(supplement.name, [Validators.required]),
          choice_only_one: new FormControl(supplement.choice_only_one, [Validators.required]),
          max_options: new FormControl(supplement.max_options),
          options: this.setOptions(supplement.options),
        }));
    });
  }

  setOptions(options: ProductSupplementOptionsInterface[]) {
    const arr = new FormArray([], Validators.minLength(1));
    options.forEach((option) => {
      arr.push(this.formBuilder.group({
        id: option.id,
        name: new FormControl(option.name, [Validators.required]),
        price: new FormControl(option.price),
      }));
    });
    return arr;
  }

  addNewSupplement() {
    const control = this.formProductSupplements.controls['supplements'] as FormArray;
    control.push(
      this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        choice_only_one: new FormControl(false, [Validators.required]),
        max_options: new FormControl(''),
        options: this.formBuilder.array([this.createOptionGroup()]),
      }),
    );
  }

  createOptionGroup() {
    return this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      price: new FormControl(''),
      validators: [Validators.minLength(1)],
    });
  }

  deleteSupplement(index: number) {
    const control = this.formProductSupplements.controls['supplements'] as FormArray;
    control.removeAt(index);
  }

  addNewOption(control) {
    control.push(this.createOptionGroup());
  }

  deleteOption(control, optionIndex) {
    control.removeAt(optionIndex);
  }

  getFormControls(form: FormArray | FormGroup, control: string) {
    return form.controls[control].controls;
  }

  choiceOnlyOne(control) {
    control.controls['choice_only_one'].value = !control.controls['choice_only_one'].value;
    control.controls['max_options'].value = control.controls['choice_only_one'].value ? 1 : '';
  }
}
