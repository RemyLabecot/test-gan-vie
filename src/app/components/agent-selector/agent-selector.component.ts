import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {CraGeneratorStore} from '../../app.store';
import {
  DropdownOption,
  GenericDropdownComponent
} from '../../shared/components/generic-dropdown/generic-dropdown.component';

@Component({
  selector: 'app-agent-selector',
  templateUrl: './agent-selector.component.html',
  styleUrls: ['./agent-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    GenericDropdownComponent
  ]
})
export class AgentSelectorComponent {
  craGeneratorStore = inject(CraGeneratorStore);

  get agentOptions(): DropdownOption[] {
    return this.craGeneratorStore.getAgentsByCurrentProject().map(agent => ({
      id: agent.id,
      value: agent.id.toString(),
      displayText: agent.name
    }));
  }

  onAgentSelected(event: string | number) {
    const selectedAgentId = Number(event);
    const selectedAgent = this.craGeneratorStore.projects()
      .find((project) => project.id === this.craGeneratorStore.currentSelectedProjectId())?.agents
      .find((agent) => agent.id === selectedAgentId);

    if (selectedAgent) {
      this.craGeneratorStore.setCurrentSelectedAgent(selectedAgent);
    }
    this.craGeneratorStore.setRefreshCalendar(true);
  }
}
