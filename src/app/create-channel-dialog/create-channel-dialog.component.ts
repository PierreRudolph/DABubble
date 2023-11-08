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
  public channelJSON = {};
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

  public filteredMembers: User[] = [];

  constructor(public addPeopleDialog: MatDialog) {
    // setTimeout(() => {
    //   console.log('userliste is', this.userList);
    // }, 5000);

  }

  filterMember() {
    let filterValue = this.searchText.toLowerCase();
    console.log("filtered Value",filterValue);
    this.filteredMembers = []
    this.userList.forEach((u) => {
      if ((filterValue != "")) {
        let n = u.name;
        console.log("name low ",n.toLowerCase() + " "+ filterValue);
        if (n.toLowerCase().includes(filterValue)) {
          this.filteredMembers.push(u);
        }
      }
    });
    if ((filterValue != "")) {
      let n = this.user.name;
      console.log("name low ",n.toLowerCase() + " "+ filterValue);
      if (n.toLowerCase().includes(filterValue)) {
        this.filteredMembers.push(this.user);
      }
    }

    console.log("filtered Member List", this.filteredMembers);
  }

  onSubmit() {
    this.createNewChannel();
    // this.openAddPeopleDialog();
    // console.log(this.channel);
    this.fristPage = false;
  }

  make() {
    console.log("click");
    this.fristPage = true;
    let radioBAll: any = document.getElementById("allMember");
    let memberList = [];
    if (radioBAll.checked) {
      memberList.push({ "memberName": this.user.name, "memberID": this.user.idDB });
      this.userList.forEach((u) => {
        memberList.push({ "memberName": u.name, "memberID": u.idDB });
      });

      console.log("memberlist", memberList);
      this.channel.members = memberList;
      console.log("channel", this.channel);
      this.channelJSON = this.channel.toJSON();
      this.closeDialog();
    }

  }

  closeDialog() {
    this.dialogReference.close(this.channelJSON);
  }

  // openAddPeopleDialog() {
  //   this.addPeopleDialog.open(AddPeopleDialogComponent);
  //   let dialogRef = this.addPeopleDialog.open(AddPeopleDialogComponent);
  //   dialogRef.componentInstance.user = new User(this.user.toJSON());//Kopie
  //   dialogRef.componentInstance.userList = this.userList;//Kopie   
  //   dialogRef.afterClosed().subscribe(result => {

  //   });
  // }

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
    this.searchText = data;
    this.filterMember();
    // console.log(data)
    // setTimeout(() => {
    //   console.log('userliste is', this.userList)
    //   console.log(this.channel);
    // }, 5000);

    //this.searchText = data;
    //this.search();
  }

  // search() {
  //   this.filteredMembers = this.searchText === "" ? this.userList : this.userList.filter((element) => {
  //     return element.name.toLowerCase() == this.searchText.toLowerCase();
  //   });
  // }
}
