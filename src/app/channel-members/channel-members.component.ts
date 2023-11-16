import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/moduls/channel.class';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-channel-members',
  templateUrl: './channel-members.component.html',
  styleUrls: ['./channel-members.component.scss']
})
export class ChannelMembersComponent {
  public user: User = new User();
  public userList: User[] = [];
  // public allUsers: User[] = []
  // public channel: Channel;
  private chathelper: ChatHepler = new ChatHepler();
  public channel: any = this.chathelper.createEmptyThread().channel;
  public dialogRef: MatDialogRef<ChannelMembersComponent>;
  private addMembers: boolean | false;

  constructor() {}

  /**
   * 
   * @param u  JSON than contains the data of a member of a channel
   * @returns 
   */
  isMe(u:any){
    return u.memberID == this.user.idDB;
  }

  /** 
   * @param u JSON than contains the data of a member of a channel
   * @returns returns the status of the given Member
   */
  getAktive(u: any) {
    let aktive = false;
    this.userList.forEach((ul) => {
      if (ul.idDB == u.memberID) {
        aktive = ul.getAktive();
      }
    });
    return aktive;
  }

  /**   * 
   * @param id Id of the user
   * @returns  Iconpath of the Icon for the given user.
   */
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

/**
 * Finishes the process of adding a member by closing the dialog.
 */
  addMembersAction() {
    this.addMembers = true;
    this.dialogRef.close(this.addMembers);
  }
}