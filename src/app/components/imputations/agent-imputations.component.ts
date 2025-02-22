import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject} from '@angular/core';
import {CraGeneratorStore} from '../../app.store';

@Component({
  selector: 'app-agent-imputations',
  imports: [],
  templateUrl: './agent-imputations.component.html',
  styleUrl: './agent-imputations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AgentImputationsComponent {
  craGeneratorStore = inject(CraGeneratorStore);
  changeDetectorRef = inject(ChangeDetectorRef);
  monthDaysWorked = 0;
  monthDaysOff = 0;
  remainingDayOff = 0;

constructor() {
  effect(() => {
    this.monthDaysWorked = this.craGeneratorStore.getNumberOfImputationsDaysByMonthAndType('workingDay', this.craGeneratorStore.currentSelectedAgentId(),this.craGeneratorStore.currentMonth());
    this.monthDaysOff = this.craGeneratorStore.getNumberOfImputationsDaysByMonthAndType('dayOff', this.craGeneratorStore.currentSelectedAgentId(),this.craGeneratorStore.currentMonth());
    this.remainingDayOff = 7 - this.craGeneratorStore.getNumberOfAllImputationsDaysByTypeAndAgentId('dayOff', this.craGeneratorStore.currentSelectedAgentId());
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

  onAgentSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedAgentId = Number(selectElement.value);
    const selectedAgent = this.craGeneratorStore.projects()
      .find((project) => project.id === this.craGeneratorStore.currentSelectedProjectId())?.agents
      .find((agent) => agent.id === selectedAgentId);

    if (selectedAgent) {
      this.craGeneratorStore.setCurrentSelectedAgent(selectedAgent);
    }
    this.craGeneratorStore.setRefreshCalendar(true);
  }

  selectProject(project: Event) {
    const selectElement = project.target as HTMLSelectElement;
    const selectedProjectId = String(selectElement.value);
    const selectedProject = this.craGeneratorStore.projects().find((p) => p.nom === selectedProjectId);
    if (selectedProject) {
      this.craGeneratorStore.setCurrentSelectedProject(selectedProject);
    }
    this.craGeneratorStore.setRefreshCalendar(true);
  }
}
