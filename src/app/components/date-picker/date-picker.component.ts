import {ChangeDetectionStrategy, Component, computed, inject, ViewChild} from '@angular/core';
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

  onAgentSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedAgentId = Number(selectElement.value);
    const selectedAgent = this.craGeneratorStore.projects()
      .find((project) => project.id === this.craGeneratorStore.currentSelectedProjectId())?.agents
      .find((agent) => agent.id === selectedAgentId);

    if (selectedAgent) {
      this.craGeneratorStore.setCurrentSelectedAgent(selectedAgent);
    }
    this.refreshCalendar();
  }

  toggleDate(date: Date | null) {
    this.craGeneratorStore.toggleDate(date);
    this.refreshCalendar();
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

      return isDateFound ? 'selected-day' : '';
    };
  });

  refreshCalendar() {
    this.calendar?.updateTodaysDate();
  }
}
