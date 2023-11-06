import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/moduls/user.class';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  menuHidden: boolean | true | undefined;
  chPanelOpen: boolean | undefined;
  mesPanelOpen: boolean | undefined;
  @Input() user: User = new User();
  @Input() userList = [this.user];
  @Output() newItemEventUser = new EventEmitter<User>();
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(public dialog: MatDialog) { }

  addNewItem(user: User) {
    this.newItemEventUser.emit(user);
    this.newItemEvent.emit(true);
  }

  openTalk(u: User) {
    console.log("openUserTalk", u);
    this.addNewItem(u);
  }

  openCreateChannelDialog() {
    this.dialog.open(CreateChannelDialogComponent);
  }
}
