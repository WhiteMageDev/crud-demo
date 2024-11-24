import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Record } from '../add-record/record.model';

@Component({
  selector: 'app-update-record-btn',
  templateUrl: './record-action-button.component.html',
  styleUrl: './record-action-button.component.css'
})
export class RecordActionButtonComponent {
  @Input() record: Record = {} as Record;
  @Input() icon: string = '';
  @Output() getDataEvent = new EventEmitter<any>();

  clickAction = (): void => this.getDataEvent.emit(this.record.id);
}
