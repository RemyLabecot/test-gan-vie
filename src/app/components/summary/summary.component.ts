import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CraGeneratorStore} from '../../app.store';
import {subtractMonths} from '../../utils/date.utils';

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

  getCurrentMonth(): string {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');

    return `${year}-${month}`;
  }


  protected readonly subtractMonths = subtractMonths;
}
