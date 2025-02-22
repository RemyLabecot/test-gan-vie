import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CraGeneratorStore} from '../../app.store';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SummaryComponent {
  craGeneratorStore = inject(CraGeneratorStore);


}
