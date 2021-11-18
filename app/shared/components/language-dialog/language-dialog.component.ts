import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FLAGS_SPRITE } from '../../helpers/variables.helper';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LanguageService } from '../../services/language.service';
import { LanguageConfig, LANGUAGES } from '../../helpers/translate.helper';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'language-dialog',
  templateUrl: './language-dialog.component.html',
  styleUrls: ['./language-dialog.component.scss'],
})
export class LanguageDialogComponent implements OnInit {
  @Output() onSaveChanges = new EventEmitter();

  flagsSpriteName = FLAGS_SPRITE;
  languageIcon: string = '';
  languages = LANGUAGES;
  originalOrder = ((): number => 0);
  localizationForm: FormGroup = new FormGroup({
    language: new FormControl('', [Validators.required]),
  });

  constructor(
    private languageService: LanguageService,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<LanguageDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(first(), untilDestroyed(this))
      .subscribe((language) => {
        const languageField = this.localizationForm.controls['language'];
        languageField.setValue(language);
        this.setLanguageIcon(this.languages[languageField.value]);
      });
  }

  setLocalizations(langForm: FormGroup) {
    this.languageService.setLang(langForm.controls['language'].value);
    this.dialogRef.close(true);
  }

  setLanguageIcon(languageConfig: LanguageConfig) {
    if (languageConfig) {
      this.languageIcon = languageConfig.flagIconName;
      this.cdr.markForCheck();
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
