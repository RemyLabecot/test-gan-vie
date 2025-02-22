import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import {CraGeneratorStore} from '../../app.store';

@Component({
  selector: 'app-holiday-manager',
  templateUrl: './holiday-manager.component.html',
  styleUrls: ['./holiday-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HolidayManagerComponent {
  craGeneratorStore = inject(CraGeneratorStore);
  changeDetectorRef = inject(ChangeDetectorRef);
  monthDaysWorked = 0;
  monthDaysOff = 0;
  remainingDayOff = 0;

  constructor() {
    effect(() => {
      this.monthDaysWorked = this.craGeneratorStore.getNumberOfAllocationsDaysByMonthAndType(
        'workingDay',
        this.craGeneratorStore.currentSelectedAgentId(),
        this.craGeneratorStore.currentMonth()
      );
      this.monthDaysOff = this.craGeneratorStore.getNumberOfAllocationsDaysByMonthAndType(
        'dayOff',
        this.craGeneratorStore.currentSelectedAgentId(),
        this.craGeneratorStore.currentMonth()
      );
      this.remainingDayOff = 7 - this.craGeneratorStore.getNumberOfAllAllocationsDaysByTypeAndAgentId(
        'dayOff',
        this.craGeneratorStore.currentSelectedAgentId()
      );
      this.changeDetectorRef.detectChanges();
    });
  }

  activationModeConges() {
    if (this.craGeneratorStore.holidayMode()) {
      this.craGeneratorStore.setWorkMode(false);
    } else if (this.remainingDayOff > 0) {
      this.craGeneratorStore.setWorkMode(true);
    }
  }
}
