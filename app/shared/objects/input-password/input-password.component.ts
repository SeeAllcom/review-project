import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MIN_PASS_LENGTH } from '../../helpers/input-validators.helper';
import { getBackendMessage } from '../../helpers/errors.helper';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'input-password',
  templateUrl: './input-password.component.html',
})
export class InputPasswordComponent {
  @Input() formControl: FormControl = new FormControl('');
  @Input() autoCompleteType: 'on' | 'off' = 'on';
  @Input() placeholder: string = '';
  @Input() idName: string = '';
  @Input() label: string = '';
  @Input() appearance: MatFormFieldAppearance = 'fill';

  hideNewPass = true;
  minPassLength = MIN_PASS_LENGTH;

  getErrorMsg(code: string) {
    return getBackendMessage(code);
  }
}
