import { Component, Input } from '@angular/core';
import ReponseUser from '../../models/respose.model';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.css',
})
export class ProfileListComponent {
  @Input() users!: ReponseUser[];
}
