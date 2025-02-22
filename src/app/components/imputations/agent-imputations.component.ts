import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
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


}
