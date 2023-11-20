import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';
import { ChannelMembersComponent } from '../channel-members/channel-members.component';
import { AddPeopleDialogComponent } from '../add-people-dialog/add-people-dialog.component';

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
  public screenWidth: number;
  threadList: any;

  constructor(public dialog: MatDialog) {
    setTimeout(() => {
      console.log("Channel is", this.channel);

    }, 1000);
  }

  editChannelName() {
    this.toggleChanNameOnEdit();
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

  addMembersAction() {
    //this.addMembers = true;
    //this.dialogRef.close(this.addMembers);
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
    }, 500)
  }

  mobileScreenWidth() {
    return this.screenWidth < 830;
  }
}
