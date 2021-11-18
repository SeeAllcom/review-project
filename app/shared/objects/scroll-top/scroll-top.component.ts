import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss'],
})
export class ScrollTopComponent implements OnInit {
  windowScrolled: boolean;
  @Input() nearSearch: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTopLength = 760;
    this.windowScrolled = window.pageYOffset > scrollTopLength;
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  ngOnInit() {}
}
