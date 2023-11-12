import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/moduls/channel.class';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-channel-members',
  templateUrl: './channel-members.component.html',
  styleUrls: ['./channel-members.component.scss']
})
export class ChannelMembersComponent {
  public user: User = new User();
  public userList = [this.user];
  public channel: Channel;
  public dialogRef: MatDialogRef<ChannelMembersComponent>;
  private addMembers: boolean | false;



  addMembersAction() {
    this.addMembers = true;
    this.dialogRef.close(this.addMembers);
  }
}