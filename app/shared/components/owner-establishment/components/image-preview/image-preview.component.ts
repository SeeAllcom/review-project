import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {
  @Input() url: string = '';
  @Input() title: string = '';
  @Input() formControlInput: AbstractControl;
  constructor() { }

  ngOnInit(): void {
  }

  imagePreview(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (ev: any) => { this.url = ev.target.result; };
    }
  }
}
