import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import Toast from '../../models/toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  @Input() toast!: Toast;
  @Input() isClose!: boolean;
  @Output() onclose = new EventEmitter();
  constructor() {}
  closeToast = () => {
    this.onclose.emit(false);
  };
}
