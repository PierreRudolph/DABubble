import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  private chathelper: ChatHepler = new ChatHepler();
  public channel: any = this.chathelper.createEmptyThread().channel;
  public dialogRef: MatDialogRef<ChannelMembersComponent>;
  private addMembers: boolean | false;
  private userIcon: string = "";


  /**
   * 
   * @param u  JSON than contains the data of a member of a channel
   * @returns 
   */
  isMe(u: any) {
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


  /**
   * @param id Id of the user
   * @returns  Iconpath of the Icon for the given user.
   */
  getIcon(id: string) {
    this.userIcon = "";
    this.setMemberIcon(id);
    this.setActualUsersIcon(id);
    return this.userIcon;
  }


  /**
   * sets the userIcon to the found channel member
   * @param id id of the user to search of
   */
  setMemberIcon(id: string) {
    this.userList.forEach((user) => {
      if (user.idDB == id) {
        this.userIcon = user.iconPath;
      }
    })
  }


  /**
   * sets the userIcon to the found actualUser
   * @param id id of the user to search of
   */
  setActualUsersIcon(id) {
    if (this.user.idDB == id) {
      this.userIcon = this.user.iconPath;
    }
  }


  /**
   * Finishes the process of adding a member by closing the dialog.
   */
  addMembersAction() {
    this.addMembers = true;
    this.dialogRef.close(this.addMembers);
  }


  /**
   * @returns members of the actual channel expept the actual logged in user
   */
  membersExeptActualUser() {
    return this.channel.members.filter((member: { memberID: string; }) => member.memberID != this.user.idDB)
  }
}