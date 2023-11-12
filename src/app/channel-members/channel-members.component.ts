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

  constructor() {
    console.log("channel ", this.channel);
    console.log("UserList", this.userList);
    console.log("user", this.user);
    // setTimeout(() => {
    //   console.log("channel ", this.channel);
    //   console.log("UserList", this.userList);
    //   console.log("user", this.user);
    //   this.allUsers.push(this.user);
    //   this.userList.forEach((u) => {
    //     this.allUsers.push(u);
    //   });
    // }, 500);

  }

  isMe(u:any){
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
    this.addMembers = true;
    this.dialogRef.close(this.addMembers);
  }
}