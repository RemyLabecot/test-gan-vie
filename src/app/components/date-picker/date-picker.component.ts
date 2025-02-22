import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  ViewChild
} from '@angular/core';
import {CraGeneratorStore} from '../../app.store';
import {MatCalendar} from '@angular/material/datepicker';
import {toFullDateString, toMonthDayString} from '../../utils/date.utils';

@Component({
  selector: 'app-date-picker',
  imports: [
    MatCalendar
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DatePickerComponent {
  craGeneratorStore = inject(CraGeneratorStore);
  cdr = inject(ChangeDetectorRef);
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  joursFeries = [
    '01-01', // Nouvel An
    '04-21', // Lundi de Pâques
    '05-01', // Fête du Travail
    '05-08', // Victoire 1945
    '05-29', // Ascension
    '06-09', // Lundi de Pentecôte
    '07-14', // Fête Nationale
    '08-15', // Assomption
    '11-01', // Toussaint
    '11-11', // Armistice
    '12-25', // Noël
  ];

  monthDaysWorked = 0;
  monthDaysOff = 0;

  constructor() {
    this.setCurrentMonth();
    effect(() => {
      this.monthDaysWorked = this.craGeneratorStore.getNumberOfImputationsDaysByMonthAndType('workingDay', this.craGeneratorStore.currentSelectedAgentId(), this.craGeneratorStore.currentMonth());
      this.monthDaysOff = this.craGeneratorStore.getNumberOfImputationsDaysByMonthAndType('dayOff', this.craGeneratorStore.currentSelectedAgentId(), this.craGeneratorStore.currentMonth());
      if(this.craGeneratorStore.refreshCalendar()) {
        this.refreshCalendar();
      }
    });
  }

  toggleDate(date: Date | null) {
    this.setCurrentMonth();
    this.craGeneratorStore.toggleDate(date);
    this.craGeneratorStore.refreshHolidayMode();
    this.refreshCalendar();
    this.cdr.markForCheck();
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }
    const monthDayString = toMonthDayString(date);
    return !this.joursFeries.includes(monthDayString);
  };

  dateClass = computed(() => {

    return (date: Date): string => {
      const dateString = toFullDateString(date);
      const imputationsMois = this.craGeneratorStore.getImputationsByCurrentAgent();

      const isDateFound = imputationsMois
        .map((imputationMois) => imputationMois.imputations)
        .flat()
        .find((imputationJour) => imputationJour.date === dateString);

      if (isDateFound && isDateFound?.type === 'workingDay') {
        return 'selected-day';
      } else if (isDateFound && isDateFound?.type === 'dayOff') {
        return 'holy-day';
      } else {
        return '';
      }
    };
  });

  onViewChanged() {
    if (!this.calendar || !this.calendar.activeDate) {
      return;
    }
    this.setCurrentMonth();
  }

  refreshCalendar() {
    this.calendar?.updateTodaysDate();
  }

  setCurrentMonth() {
    let activeDate = this.calendar?.activeDate;
    if (!activeDate) {
      return;
    }
    let formattedDate = `${activeDate.getFullYear()}-${(activeDate.getMonth() + 1).toString().padStart(2, '0')}`;
    this.craGeneratorStore.setCurrentMonth(formattedDate);
  }
}
