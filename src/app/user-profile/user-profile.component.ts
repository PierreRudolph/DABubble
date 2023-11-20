import { Component, EventEmitter, Output } from '@angular/core';
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

  openTalk() {
    this.ref.close(this.user);
  }
}
