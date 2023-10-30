import { Component ,Input,Output,EventEmitter} from '@angular/core';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {

  @Input() user:User = new User();
  public open = false;
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(){}

  // addNewItem(user:User) {
  //   this.newItemEvent.emit(user);
  // }

}
