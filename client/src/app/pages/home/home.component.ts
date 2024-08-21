import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import User from '../../models/user.model';
import Toast from '../../models/toast.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @Output() closeToast = new EventEmitter();
  constructor(private userService: UserService) {}
  isClose: boolean = false;
  toast: Toast = {
    position: 'bottom',
    message: '',
    type: 'error',
  };
  onClose = () => {
    this.isClose = false;
  };
  isUser: boolean = false;
  user: User = {
    userId: 0,
    firstName: '',
    lastName: '',
    designationName: '',
    email: '',
    id:0,
    // profilePicture: new Blob([]),
    profilePic: '',
  };

  getUser = () => {
    console.log(this.user.userId);
    this.userService.getUserById(this.user.userId).subscribe({
      next: (data) => {
        const { designationName, firstName, lastName, profilePic,id} = data;
        this.user.firstName = firstName;
        this.user.lastName = lastName;
        this.user.designationName = designationName;
        this.user.profilePic = profilePic;
        this.isUser = true;
        this.user.id = id;
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      error: (err) => {
        this.toast.message = err.message || 'User not found';
        this.isClose = true;
        setTimeout(() => {
          this.isClose = false;
        }, 4000);
      },
    });
  };
}
