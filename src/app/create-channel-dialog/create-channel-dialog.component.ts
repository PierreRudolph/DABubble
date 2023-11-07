import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddPeopleDialogComponent } from '../add-people-dialog/add-people-dialog.component';
import { Channel } from 'src/moduls/channel.class';
import { User } from 'src/moduls/user.class';

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
  // @Input() user: User = new User();
  public user: User = new User();
  public userList = [this.user];
  public dialogReference: MatDialogRef<CreateChannelDialogComponent>;
  public fristPage = true;
  isChecked: boolean | undefined;
  //membersList: any = ['Elias', 'Brigitte', 'Thorben'];
  searchedMembers: Array<string> = [];

  // @Input() channel: Channel = new Channel();
  searchText: any;
  filteredMembers: any;

  constructor(public addPeopleDialog: MatDialog) {
    setTimeout(() => {
      console.log('userliste is', this.userList);
    }, 5000);
  }

  onSubmit() {
    this.createNewChannel();
    // this.openAddPeopleDialog();
    // console.log(this.channel);
    this.fristPage = false;
  }

  openAddPeopleDialog() {
    this.addPeopleDialog.open(AddPeopleDialogComponent);
    let dialogRef = this.addPeopleDialog.open(AddPeopleDialogComponent);
    dialogRef.componentInstance.user = new User(this.user.toJSON());//Kopie
    dialogRef.componentInstance.userList = this.userList;//Kopie   
    dialogRef.afterClosed().subscribe(result => {
      this.fristPage = true;
    });
  }

  createNewChannel() {
    this.channel.name = this.channelName;
    this.channel.description = this.channelDescription;
    this.channel.members = this.channelMembers;
  }

  setValue() {
    this.isChecked = !this.isChecked;
  }

  // ngOnInit(): void {
  //   this.search();
  // }

  searchKey(data: string) {
    console.log(data)
    setTimeout(() => {
      console.log('userliste is', this.userList)
      console.log(this.channel);
    }, 5000);

    //this.searchText = data;
    //this.search();
  }

  search() {
    this.filteredMembers = this.searchText === "" ? this.userList : this.userList.filter((element) => {
      return element.name.toLowerCase() == this.searchText.toLowerCase();
    });
  }
}
