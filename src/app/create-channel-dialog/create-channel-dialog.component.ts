import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/moduls/channel.class';
import { User } from 'src/moduls/user.class';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-create-channel-dialog',
  templateUrl: './create-channel-dialog.component.html',
  styleUrls: ['./create-channel-dialog.component.scss']
})
export class CreateChannelDialogComponent {
  public dialogReference: MatDialogRef<CreateChannelDialogComponent>;
  private channel: Channel = new Channel();
  public user: User = new User();
  public userList = [this.user];
  public filteredMembers: User[] = [];
  public currentlyAddedUser: User[] = [];
  private channelJSON: any = {};
  public channelName: string = "";
  public channelDescription: string = "";
  private channelMembers: any = [];
  public searchText: string = "";
  public firstPage: boolean = true;
  public showSearchUserInput: boolean = false;
  private memberList: Array<any> = [];
  @ViewChild('allMemberInput') allMemberInput: ElementRef;
  constructor(public addPeopleDialog: MatDialog, public screen: ScreenService) { }


  /**
   * Puts the given user in the currentlyAddedUser list
   * @param u User 
   */
  addMember(u: User) {
    let inList = false;
    this.currentlyAddedUser.forEach(ul => {
      if (ul.idDB == u.idDB) { inList = true };
    });
    if (!inList) {
      this.currentlyAddedUser.push(u);
    }
  }


  /**   
   * @param us User that should be deleted
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


  /** * 
   * @returns Wheather a person is found when serching the name.
   */
  isPopUpOpen() {
    return this.filteredMembers.length > 0;
  }


  /**
   * Filters out all user, that contain a spezific string (given in searchText) and strores them in filteredMembers.
   */
  filterMember() {
    this.filteredMembers = []
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
    this.setChannelNameAndDescr();
    this.firstPage = false;
  }


  /**
    * Sets data for a new Channnel
    */
  setChannelNameAndDescr() {
    this.channel.name = this.channelName;
    this.channel.description = this.channelDescription;
  }


  /**
   * Make the new channel
   */
  createChannel() {
    this.firstPage = true;
    this.addUsersToChannel();
    this.setChannelValues();
    this.closeDialog();
  }


  addUsersToChannel() {
    if (this.allMemberInput.nativeElement.checked) {
      this.addAllUsersToChannel();
    } else {
      this.addSelectedUsersToChannel();
    }
  }


  addAllUsersToChannel() {
    this.memberList.push({ "memberName": this.user.name, "memberID": this.user.idDB });
    this.userList.forEach((u) => {
      this.memberList.push({ "memberName": u.name, "memberID": u.idDB });
    });
  }


  addSelectedUsersToChannel() {
    this.addMember(this.user);
    this.currentlyAddedUser.forEach((us) => {
      this.memberList.push({ "memberName": us.name, "memberID": us.idDB });
    });
  }


  setChannelValues() {
    this.channel.members = this.memberList;
    this.channel.creator = this.user.name;
    this.channelJSON = this.channel.toJSON();
  }


  closeDialog() {
    this.dialogReference.close(this.channelJSON);
  }


  setValue(allOrPartOfUsers: string) {
    this.toggleSearchUserInputBol();
    if (allOrPartOfUsers == 'allUser') {
      this.clearSearchedUser();
    }
  }


  clearSearchedUser() {
    this.searchText = '';
    this.filteredMembers = [];
    this.currentlyAddedUser = [];
  }


  /** Initiate the filtering of members by the given keyword 
   * @param data  Searchstring, that shell be included in the userlist
   */
  searchKey(data: string) {
    this.searchText = data;
    this.filterMember();
  }


  toggleSearchUserInputBol() {
    this.showSearchUserInput = !this.showSearchUserInput;
  }
}
