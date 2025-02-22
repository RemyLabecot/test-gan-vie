import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {CraGeneratorStore} from '../../app.store';
import {
  DropdownOption,
  GenericDropdownComponent
} from '../../shared/components/generic-dropdown/generic-dropdown.component';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    GenericDropdownComponent
  ]
})
export class ProjectSelectorComponent {
  craGeneratorStore = inject(CraGeneratorStore);

  get projectOptions(): DropdownOption[] {
    return this.craGeneratorStore.projects().map(project => ({
      id: project.id,
      value: project.name,
      displayText: project.name
    }));
  }

  selectProject(event: string | number) {
    const selectedProjectId = String(event);
    const selectedProject = this.craGeneratorStore.projects().find((p) => p.name === selectedProjectId);
    if (selectedProject) {
      this.craGeneratorStore.setCurrentSelectedProject(selectedProject);
    }
    this.craGeneratorStore.setRefreshCalendar(true);
  }
}
