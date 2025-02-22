import {ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {CraGeneratorStore} from './app.store';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {SummaryComponent} from './components/summary/summary.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import {ProjectsEnum} from './enum/projects.enum';
import {AgentSelectorComponent} from "./components/agent-selector/agent-selector.component";
import {HolidayManagerComponent} from "./components/holiday-manager/holiday-manager.component";
import {ProjectSelectorComponent} from "./components/project-selector/project-selector.component";

@Component({
  selector: 'app-root',
    imports: [
        DatePickerComponent,
        SummaryComponent,
        AgentSelectorComponent,
        HolidayManagerComponent,
        ProjectSelectorComponent
    ],
  providers: [CraGeneratorStore, provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AppComponent {
  @ViewChild(DatePickerComponent) datePickerComponent: DatePickerComponent | undefined;
  craGeneratorStore = inject(CraGeneratorStore);



  forceRefreshCalendar() {
    this.datePickerComponent?.refreshCalendar();
  }

  protected readonly ProjectsEnum = ProjectsEnum;
}
