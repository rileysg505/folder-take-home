import {
  Pipe,
  PipeTransform,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false, // Set pure to false for dynamic updates
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private destroyed$ = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    // Update the pipe value every minute
    interval(60000) // 60000 ms = 1 minute
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
  }

  transform(createdAt: string): string {
    const now = new Date();
    const createdDate = new Date(createdAt);

    const diff = Math.abs(now.getTime() - createdDate.getTime());
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day(s) ago`;
    } else if (hours > 0) {
      return `${hours} hour(s) ago`;
    } else {
      return `${minutes} minute(s) ago`;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
