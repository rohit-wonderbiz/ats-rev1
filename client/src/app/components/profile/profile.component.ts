import { Component, Input } from '@angular/core';
import User from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  @Input() user!: User;
  // getProfilePictureUrl(profilePicture: Blob ): string {
  //   if(typeof(profilePicture)==typeof("abc")){
  //     return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnthxouxNI3jDYw3oQWvCY3aa9f3MLnh0iag&s';
  //   }
  //   // if (profilePicture.size === 0) {
  //   //   return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnthxouxNI3jDYw3oQWvCY3aa9f3MLnh0iag&s';
  //   // }
  //   // return URL.createObjectURL(profilePicture);
  // }
}
