import { Component } from '@angular/core';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  public user: User = new User();
  public ref: any;

  closeDialog() {
    this.ref.close();
  }

  // setNewMessage() {
  //   this.newMessage = !this.newMessage;
  //   console.log("value", this.newMessage);
  //   this.isOpen.emit(this.newMessage);

  // }
}
