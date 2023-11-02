import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/moduls/user.class';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  menuHidden: boolean | true | undefined;
  chPanelOpen: boolean | undefined;
  mesPanelOpen: boolean | undefined;
  @Input() user:User = new User();
  @Input() userList=[this.user];
  @Output() newItemEventUser = new EventEmitter<User>();
  @Output() newItemEvent = new EventEmitter<boolean>();

  addNewItem(user:User) {
    this.newItemEventUser.emit(user);
    this.newItemEvent.emit(true);
  }

  openTalk(u:User){
    console.log("openUserTalk",u);
    this.addNewItem(u);
 }
 
}