import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export function matchOtherValidator(otherControlName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const otherControl: AbstractControl | null = control.root.get(otherControlName);

    if (otherControl) {
      const subscription: Subscription = otherControl
        .valueChanges
        .subscribe(() => {
          control.updateValueAndValidity();
          subscription.unsubscribe();
        });
    }
    return (otherControl && control.value !== otherControl.value) ? {match: true} : null;
  };
}

export const MIN_PASS_LENGTH = 8;

export const VALIDATION_PASSWORD_REGEXP = `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{${MIN_PASS_LENGTH},}$`;
export const VALIDATION_EMAIL_DOMAIN_REGEXP = /^[a-zA-z0-9\.\-\+\~\"(.)*\"\!\#\$\%\&\'\/\=\?\^_\{\}\|]+(@){1}(([a-zA-z0-9]+(\-+[a-zA-z0-9]+)*\.{1}[a-zA-z0-9]+(\.{1}[a-zA-z0-9]+)*)|([0-9]{1,3}(\.{1}[0-9]{1,3}){3})|([0-9a-fA-F]{1,4}(\:{1}[0-9a-fA-F]{1,4}){7}))[^_]$/;
export const EMAIL_VALIDATION_ERRORS = {
  required: marker('Будь ласка, введіть вашу електронну адресу'),
  pattern: marker('Будь ласка, введіть правильну електронну адресу'),
  emailTaken: marker('Ця електронна адреса вже зареєстрований.'),
};
