import { FormGroup } from '@angular/forms';

export function fieldsAreNotEqual(firstField: string, secondField: string) {
  return (form: FormGroup) => {
    const fieldFirst = form.controls[firstField];
    const fieldSecond = form.controls[secondField];
    if (fieldFirst.value === fieldSecond.value) {
      return {notEquivalent: true};
    } else {
      return null;
    }
  };
}
