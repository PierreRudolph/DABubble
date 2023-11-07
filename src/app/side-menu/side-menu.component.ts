import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { User } from 'src/moduls/user.class';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  menuHidden: boolean | false | undefined;
  chPanelOpen: boolean | undefined;
  mesPanelOpen: boolean | undefined;
  private chathelper: ChatHepler = new ChatHepler();
  @Input() user: User = new User();
  @Input() userList = [this.user];
  @Input() threadList = [{ "channel": { "name": "channelname" } }]// [this.chathelper.createEmptyThread()];
  @Output() newItemEventUser = new EventEmitter<User>();
  @Output() newItemEventChanel = new EventEmitter<any>();
  @Output() newItemEvent = new EventEmitter<boolean>();
  public loaded: boolean = false;

  constructor(public dialog: MatDialog) {
    console.log("threadist construktor", this.threadList);
    console.log("channel name", this.threadList[0].channel.name);
    setTimeout(() => {
      this.loaded = true; //wegen ladeproblemen
    }, 3000);
  }

  getName(num: number) {
    if (this.loaded) { return this.threadList[num].channel.name }
    else {
      return ""
    };
  }

  addNewItem(user: User) {
    this.newItemEventUser.emit(user);
    this.newItemEvent.emit(true);
  }

  openTalk(u: User) {
    console.log("openUserTalk", u);
    this.addNewItem(u);
         }

  openCreateChannelDialog() {
    // this.dialog.open(CreateChannelDialogComponent);
    // this.dialog.componentInstance();
    let dialogRef = this.dialog.open(CreateChannelDialogComponent);
    dialogRef.componentInstance.user = new User(this.user.toJSON());//Kopie
    dialogRef.componentInstance.userList = this.userList;//Kopie
    dialogRef.componentInstance.dialogReference=dialogRef;
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }

  openChannel(n: number) {
    this.newItemEventChanel.emit(n);
  }

}
