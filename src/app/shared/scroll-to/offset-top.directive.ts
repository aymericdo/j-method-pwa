import { Directive, ElementRef } from '@angular/core';

@Directive({ selector: '[appOffsetTop]'})
export class OffsetTopDirective {
  constructor(private _el: ElementRef) { }
  get offsetTop(): number { return this._el.nativeElement.offsetTop; }
  get dataValues(): object {
    const keys = Object.keys(this._el.nativeElement).filter(k => k.startsWith('data-'));
    return keys.reduce((prev, key) => {
      prev[key] = this._el.nativeElement[key];
      return prev;
    }, {});
  }
}
