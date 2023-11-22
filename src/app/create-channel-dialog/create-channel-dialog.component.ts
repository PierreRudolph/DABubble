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
  public channelJSON: any = {};
  channelName: string = "";
  channelDescription: string = "";
  channelMembers: any = [];
  // @Input() user: User = new User();
  public user: User = new User();
  public userList = [this.user];
  public dialogReference: MatDialogRef<CreateChannelDialogComponent>;
  public fristPage = true;
  public screenWidth: number;
  isChecked: boolean | undefined;
  //membersList: any = ['Elias', 'Brigitte', 'Thorben'];
  searchedMembers: Array<string> = [];

  // @Input() channel: Channel = new Channel();
  searchText: any;

  public filteredMembers: User[] = [];
  public currentlyAddedUser: User[] = [];

  constructor(public addPeopleDialog: MatDialog) {

  }

  /**
   * Puts the given user in the currentlyAddedUser list
   * @param u User 
   */
  addMember(u: User) {
    let inList = false;  // "strict": false, in compileoptions    
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
    let filterValue = this.searchText.toLowerCase();
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
    this.createNewChannel();

    this.fristPage = false;

  }

  /**
   * Mak the new channel
   */
  make() {
    this.addMember(this.user);
    this.fristPage = true;

    let radioBAll: any = document.getElementById("allMember");
    let memberList = [];

    if (radioBAll.checked) {  //all User are selected as Member
      memberList.push({ "memberName": this.user.name, "memberID": this.user.idDB });
      this.userList.forEach((u) => {
        memberList.push({ "memberName": u.name, "memberID": u.idDB });
      });

    } else { //Only a part of the users are selected as members
      this.currentlyAddedUser.forEach((us) => {
        memberList.push({ "memberName": us.name, "memberID": us.idDB });
      });
    }
    this.channel.members = memberList;
    this.channelJSON = this.channel.toJSON();
    this.channelJSON.creator = this.user.name;
    this.closeDialog();

  }

  closeDialog() {
    this.dialogReference.close(this.channelJSON);
  }

  /**
   * Sets data for a new Channnel
   */
  createNewChannel() {
    this.channel.name = this.channelName;
    this.channel.description = this.channelDescription;
    this.channel.members = this.channelMembers;
  }

  setValue() {
    this.isChecked = !this.isChecked;
  }

  /** Initiate the filtering of members by the given keyword 
   * @param data  Searchstring, that shell be included in the userlist
   */
  searchKey(data: string) {
    this.searchText = data;
    this.filterMember();

  }
  mobileScreenWidth() {
    return this.screenWidth < 830;
  }
}
