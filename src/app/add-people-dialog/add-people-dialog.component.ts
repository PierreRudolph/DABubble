import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-add-people-dialog',
  templateUrl: './add-people-dialog.component.html',
  styleUrls: ['./add-people-dialog.component.scss']
})

export class AddPeopleDialogComponent {
  public user: User = new User();
  public userList: Array<any> = [this.user];
  public searchText: string;
  private channelJSON: any = {};
  public filteredMembers: User[] = [];
  public currentlyAddedUserList: User[] = [];
  private dialogReference: MatDialogRef<AddPeopleDialogComponent>;
  private chathelper: ChatHepler = new ChatHepler();
  public channel: any = this.chathelper.createEmptyThread();
  public mobileFromBottom: boolean | false;
  public userInList: boolean = false;

  constructor(public addPeopleDialog: MatDialog) { }


  /**
   * Adds the given User do the currentlyAddedUser-List
   * @param u User that shall be added as a member
   */
  addMember(u: User) {
    this.checkIfIsAlreadyAdded(u);
    this.checkIfIsAlreadyMember(u);
    if (!this.userInList) {
      this.currentlyAddedUserList.push(u);
    } else {
      setTimeout(() => { this.userInList = false; }, 1000)
    }
  }


  /**
   * iterates thru members of actual channel, checks if given user is already member of actual channel
   * @param u User that shall be added as member
   */
  checkIfIsAlreadyMember(u: User) {
    this.channel.members.forEach((user: { memberID: string; idDB: string; }) => {
      if (user.memberID == u.idDB) { this.userInList = true };
    });
  }


  /**
   * iterates thru currently added user array, checks if given user is already added to actual channel
   * @param u User that shall be added as member
   */
  checkIfIsAlreadyAdded(u: User) {
    this.currentlyAddedUserList.forEach(user => {
      if (user.idDB == u.idDB) { this.userInList = true };
    });
  }


  /**
   * 
   * @param us User that should  be removes from the MemberList
   */
  deleteUser(us: User) {
    for (let i = 0; i < this.currentlyAddedUserList.length; i++) {
      if (this.currentlyAddedUserList[i].idDB == us.idDB) {
        this.currentlyAddedUserList.splice(i, 1);
      }
    }
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


  /**
   * Make the memberlist for the current channel
   */
  async addUsersToChannel() {
    this.currentlyAddedUserList.forEach((us) => {
      this.channel.members.push({ "memberName": us.name, "memberID": us.idDB });
    });
    await this.chathelper.updateDB(this.channel.idDB, "thread", { "channel": this.channel });
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
