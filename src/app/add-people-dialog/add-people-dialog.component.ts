import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/moduls/channel.class';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-add-people-dialog',
  templateUrl: './add-people-dialog.component.html',
  styleUrls: ['./add-people-dialog.component.scss']
})

export class AddPeopleDialogComponent {
  public searchedMembers: Array<string> = [];
  public user: User = new User();
  public userList = [this.user];
  public searchText: any;
  // public channel: Channel;
  public channelJSON = {};
  public filteredMembers: User[] = [];
  public currentlyAddedUser: User[] = [];
  public fristPage = true;
  public dialogReference: MatDialogRef<AddPeopleDialogComponent>;

  private chathelper: ChatHepler = new ChatHepler();
  public channel: any = this.chathelper.createEmptyThread();


  constructor(public addPeopleDialog: MatDialog) {
    setTimeout(() => {
      console.log(this.channel);
      console.log('userlist ist', this.userList);
    }, 1000);

  }

  addMember(u: User) {
    let inList = false;  // "strict": false, in compileoptions
    console.log("actua member", this.channel.members);
    this.channel.members.forEach(ul => {
      if (ul.memberID == u.idDB) { inList = true };
    });
    if (!inList) {
      this.currentlyAddedUser.push(u);
      console.log("currently users", this.currentlyAddedUser);
    }
    else {
      console.log("Uster ist bereits in der Liste");
    }
   
  }

  deleteUser(us: User) {
    let array: User[] = [];
    this.currentlyAddedUser.forEach((u) => {
      if (u.idDB != us.idDB) {
        array.push(u);
      }
    });
    this.currentlyAddedUser = array;
  }


  isPopUpOpen() {
    return this.filteredMembers.length > 0;
  }

  filterMember() {
    let filterValue = this.searchText.toLowerCase();
    console.log("filtered Value", filterValue);
    this.filteredMembers = []

    this.userList.forEach((u) => {
      if ((filterValue != "")) {
        let n = u.name;
        console.log("name low ", n.toLowerCase() + " " + filterValue);
        if (n.toLowerCase().includes(filterValue)) {
          this.filteredMembers.push(u);
        }
      }
    });

    if ((filterValue != "")) {
      let n = this.user.name;
      console.log("name low ", n.toLowerCase() + " " + filterValue);
      if (n.toLowerCase().includes(filterValue)) {
        this.filteredMembers.push(this.user);
      }
    }

    console.log("filtered Member List", this.filteredMembers);
  }

  onSubmit() {
    this.fristPage = false;
  }

  make() {
    console.log("click");
    this.fristPage = true;  
    this.currentlyAddedUser.forEach((us) => {
      this.channel.members.push({ "memberName": us.name, "memberID": us.idDB });
    });
    console.log("channel ", this.channel);
    this.chathelper.updateDB(this.channel.idDB,"thread",{"channel":this.channel});   
  }

  searchKey(data: string) {
    this.searchText = data;
    this.filterMember();

  }



  closeDialog() {
    this.dialogReference.close(this.channelJSON);
  }
}
