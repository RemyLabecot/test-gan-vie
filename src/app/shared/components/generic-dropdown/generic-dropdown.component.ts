import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface DropdownOption {
  id: number | string;
  value: string;
  displayText: string;
}

@Component({
  selector: 'app-generic-dropdown',
  templateUrl: './generic-dropdown.component.html',
  styleUrls: ['./generic-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class GenericDropdownComponent {
  @Input() label: string = '';
  @Input() labelId: string = '';
  @Input() options: DropdownOption[] = [];
  @Input() selectedId: number | string | null = null;
  @Input() stepNumber: number | null = null;

  @Output() selectionChange = new EventEmitter<string | number>();

  onSelectionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectionChange.emit(selectElement.value);
  }
}
