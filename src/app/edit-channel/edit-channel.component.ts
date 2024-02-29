import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';
import { AddPeopleDialogComponent } from '../add-people-dialog/add-people-dialog.component';
import { ScreenService } from '../screen.service';
import { Channel } from 'src/moduls/channel.class';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent {
  private chathelper: ChatHepler = new ChatHepler();
  public channel: Channel = new Channel();
  public showChanNamOnEdit: boolean = false;
  public showChanDescOnEdit: boolean = false;
  public user: User = new User();
  public userList: Array<User> = [this.user];
  @ViewChild('channelNameInput') channelNameInput: ElementRef;
  @ViewChild('channelDescInput') channelDescInput: ElementRef;
  constructor(public dialog: MatDialog, public screen: ScreenService) { }


  editChannelName() {
    this.toggleChanNameOnEdit();
    setTimeout(() => {
      this.channelNameInput.nativeElement.value = this.channel.name;
    }, 10);
  }


  async leaveChannel() {
    let newList = [];
    this.channel.members.forEach((member) => {
      if (member.memberID != this.user.idDB) {
        newList.push(member);
      }
    });
    this.channel.members = newList;
    await this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
  }


  /**
   * Saves the new name of the channel
   */
  async saveNewChannelName() {
    let newName = this.channelNameInput.nativeElement.value;
    this.channel.name = newName;
    await this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
    this.toggleChanNameOnEdit();
  }


  /**
  * Belends in the editing windows for the name
  */
  toggleChanNameOnEdit() {
    this.showChanNamOnEdit = !this.showChanNamOnEdit;
  }


  editChannelDesc() {
    this.toggleChanDescOnEdit();
    setTimeout(() => {
      this.channelDescInput.nativeElement.value = this.channel.description;
    }, 10);
  }


  /**
   * Saves the changed description
   */
  async saveNewChannelDesc() {
    let newDesc = this.channelDescInput.nativeElement.value;
    this.channel.description = newDesc;
    await this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
    this.toggleChanDescOnEdit();
  }


  toggleChanDescOnEdit() {
    this.showChanDescOnEdit = !this.showChanDescOnEdit;
  }


  isItMe(u: any) {
    return u.memberID == this.user.idDB;
  }


  getAktive(u: any) {
    let aktive = false;
    this.userList.forEach((user) => {
      if (user.idDB == u.memberID) {
        aktive = user.getAktive();
      }
    });
    return aktive;
  }


  getIcon(id: string) {
    let icon = "";
    this.userList.forEach((user) => {
      if (user.idDB == id) {
        icon = user.iconPath;
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
    dialogRef.updatePosition({ bottom: '-470px' });
    this.dialogSlideFromBottomUp(dialogRef);
  }


  dialogSlideFromBottomUp(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    setTimeout(() => {
      dialogRef.addPanelClass('transition225');
      dialogRef.updatePosition({ bottom: '-20px' });
    }, 225)
  }
}
