import { FormGroup } from '@angular/forms';

export function fieldsAreEqual(firstField: string, secondField: string) {
  return (form: FormGroup) => {
    const fieldFirst = form.controls[firstField];
    const fieldSecond = form.controls[secondField];
    if (fieldFirst.value !== fieldSecond.value) {
      return {equivalent: true};
    } else {
      return null;
    }
  };
}
