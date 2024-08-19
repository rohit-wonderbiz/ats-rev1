import { Component, Input } from '@angular/core';
import User from '../../models/user.model';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.css',
})
export class ProfileListComponent {

  @Input() users!: User[];
  


}
