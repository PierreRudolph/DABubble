import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';
import { ScreenService } from '../screen.service';

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
  public channelJSON = {};
  public filteredMembers: User[] = [];
  public currentlyAddedUser: User[] = [];
  public fristPage = true;
  public dialogReference: MatDialogRef<AddPeopleDialogComponent>;
  private chathelper: ChatHepler = new ChatHepler();
  public channel: any = this.chathelper.createEmptyThread();
  public mobileFromBottom: boolean | false;
  public userInList = false;

  constructor(public addPeopleDialog: MatDialog, public screen: ScreenService) { }


  /**
   * Adds the given User do the currentlyAddedUser
   * @param u User that shell be added as a member
   */
  addMember(u: User) {
    let inList = false;
    this.currentlyAddedUser.forEach(ul => {
      if (ul.idDB == u.idDB) { inList = true };
    });
    if (this.isAlreadyMember(u)) { inList = true; }

    if (!inList) {
      this.currentlyAddedUser.push(u);
    } else {
      this.userInList = true;
      setTimeout(() => { this.userInList = false; }, 2000)

    }
  }


  isAlreadyMember(user: User) {
    let inList = false;
    this.channel.members.forEach(ul => {
      if (ul.memberID == user.idDB) { inList = true };
    });
    return inList;
  }


  /**
   * 
   * @param us User that should  be removes from the MemberList
   */
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


  /**
   * Only shows the list of member
   */
  filterMember() {
    this.filteredMembers = [];
    this.userList.forEach((u) => {
      this.setMemberToList(u);
    });
    this.setMemberToList(this.user);
  }


  /**  
   * Sets all User that are containing the searchText in the Name to the filteredMembers
   * @param u User
   */
  setMemberToList(u: User) {
    let filterValue = this.searchText.toLowerCase();
    if ((filterValue != "")) {
      let n = u.name;
      if (n.toLowerCase().includes(filterValue)) {
        this.filteredMembers.push(u);
      }
    }
  }


  onSubmit() {
    this.fristPage = false;
  }


  /**
   * Make the memberlist for the current channel
   */
  make() {
    this.fristPage = true;
    this.currentlyAddedUser.forEach((us) => {
      this.channel.members.push({ "memberName": us.name, "memberID": us.idDB });
    });
    this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
  }


  /**
   * Searches in the Userlist for a specific keyworld
   * @param data 
   */
  searchKey(data: string) {
    this.searchText = data;
    this.filterMember();

  }


  closeDialog() {
    this.dialogReference.close(this.channelJSON);
  }
}
