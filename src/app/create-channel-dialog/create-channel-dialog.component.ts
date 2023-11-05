import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPeopleDialogComponent } from '../add-people-dialog/add-people-dialog.component';
import { Channel } from 'src/moduls/channel.class';

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrls: ['./create-channel-dialog.component.scss']
})
export class CreateChannelDialogComponent {
  public channel: Channel = new Channel();
  channelName: string = "";
  channelDescription: string = "";
  channelMembers: any = [];

  constructor(public addPeopleDialog: MatDialog) { }

  onSubmit() {
    this.createNewChannel();
    this.openAddPeopleDialog();
    console.log(this.channel);
  }

  openAddPeopleDialog() {
    this.addPeopleDialog.open(AddPeopleDialogComponent);
  }

  createNewChannel() {
    this.channel.name = this.channelName;
    this.channel.description = this.channelDescription;
    this.channel.members = this.channelMembers;
  }
}
