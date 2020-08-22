import { Component, Output, EventEmitter, AfterViewInit, ViewChildren, QueryList, ViewChild, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { OffsetTopDirective } from 'src/app/shared/scroll-to/offset-top.directive';
import { ScrollableDirective } from 'src/app/shared/scroll-to/scrollable.directive';

@Component({
  selector: 'app-hours-selector',
  templateUrl: './hours-selector-dialog.component.html',
  styleUrls: ['./hours-selector-dialog.component.scss']
})
export class HoursSelectorDialogComponent implements AfterViewInit {
  @Output() deltaChanged: EventEmitter<number> = new EventEmitter<number>();
  @ViewChildren(OffsetTopDirective) listItems: QueryList<OffsetTopDirective>;
  @ViewChild(ScrollableDirective) list: ScrollableDirective;

  hoverHour = null;

  private baseArray: number[] = Array.from(Array(100).keys()).slice(1);

  minutes: number[] = [...this.baseArray];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: { duration: number },
    private bottomSheetRef: MatBottomSheetRef<HoursSelectorDialogComponent>,
  ) { }

  ngAfterViewInit(): void {
    const match = this.listItems.find((el, i) => el.dataValues['data-min'] + 2 === this.data.duration);
    this.list.scrollTop = match ?
      match.offsetTop :
      this.data.duration < 3 ? this.listItems.first.offsetTop : this.listItems.last.offsetTop;
  }

  addNextBatch(): void {
    const lastMinute: number = this.minutes[this.minutes.length - 1];
    this.baseArray.forEach((m) => {
      this.minutes.push(lastMinute + m);
    });
  }

  handleClick(minutes: number): void {
    this.deltaChanged.emit(minutes);
    this.bottomSheetRef.dismiss();
  }

  trackByMethod(index: number, el: string): string {
    return el;
  }
}
