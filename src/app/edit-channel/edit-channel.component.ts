import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';
import { AddPeopleDialogComponent } from '../add-people-dialog/add-people-dialog.component';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {
  chanNamOnEdit: boolean | false;
  chanDescOnEdit: boolean | false;
  private chathelper: ChatHepler = new ChatHepler();
  public channel: any = this.chathelper.createEmptyThread().channel;
  public user: User = new User();
  public userList = [this.user];
  threadList: any;

  constructor(public dialog: MatDialog, public screen: ScreenService) {
  }

  editChannelName() {
    this.toggleChanNameOnEdit();
    setTimeout(() => {
      (document.getElementById("nameChannel") as HTMLInputElement | null).value = this.channel.name;
    }, 125);
  }

  leaveChannel() {
    let member = this.channel.members;
    let list = [];
    member.forEach((m) => {
      if (m.memberID != this.user.idDB) {
        list.push(m);
      }
    });
    this.channel.members = list;
    this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
  }

  /**
   * Saves the new name of the channel
   */
  saveNewChannelName() {
    let value = (document.getElementById("nameChannel") as HTMLInputElement | null)?.value;
    this.channel.name = value;
    this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
    this.toggleChanNameOnEdit();
  }

  /**
  * Belends in the editing windows for the name
  */
  toggleChanNameOnEdit() {
    this.chanNamOnEdit = !this.chanNamOnEdit;
  }

  editChannelDesc() {
    this.toggleChanDescOnEdit();
    setTimeout(() => {
      (document.getElementById("description") as HTMLInputElement | null).value = this.channel.description;
    }, 125);
  }
  /**
   * Saves the changed description
   */
  saveNewChannelDesc() {
    let value = (document.getElementById("description") as HTMLInputElement | null)?.value;
    this.channel.description = value;
    this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
    this.toggleChanDescOnEdit();
  }

  /**
   * Belends in the editing windows for the Description
   */
  toggleChanDescOnEdit() {
    this.chanDescOnEdit = !this.chanDescOnEdit;
  }

  isMe(u: any) {
    return u.memberID == this.user.idDB;
  }

  getAktive(u: any) {
    let aktive = false;
    this.userList.forEach((ul) => {
      if (ul.idDB == u.memberID) {
        aktive = ul.getAktive();
      }
    });
    return aktive;
  }

  getIcon(id: string) {
    let icon = "";
    this.userList.forEach((ul) => {
      if (ul.idDB == id) {
        icon = ul.iconPath;
      }
    })
    if (this.user.idDB == id) {
      icon = this.user.iconPath;
    }
    return icon;
  }


  openAddPeopleDialog() {
    let dialogRef = this.dialog.open(AddPeopleDialogComponent);
    this.setAddPeopleStyle(dialogRef);
    dialogRef.componentInstance.channel = this.channel;
    dialogRef.componentInstance.userList = this.userList;
    dialogRef.componentInstance.user = this.user;
    dialogRef.componentInstance.mobileFromBottom = true;
    dialogRef.afterClosed().subscribe(() => {
      dialogRef.componentInstance.mobileFromBottom = false;
    })
  }

  setAddPeopleStyle(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.addPanelClass('maxWidth100');
    dialogRef.addPanelClass('addPeopleDialogMobileStyle');
    dialogRef.updatePosition({ bottom: '-470px' });

    setTimeout(() => {
      dialogRef.addPanelClass('transition225');
      dialogRef.updatePosition({ bottom: '-20px' });
    }, 225)
  }
}
