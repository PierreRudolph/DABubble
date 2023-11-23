import { Component, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { User } from 'src/moduls/user.class';
import { EditChannelComponent } from '../edit-channel/edit-channel.component';
import { SmileHelper } from 'src/moduls/smileHelper.class';
import { AddPeopleDialogComponent } from '../add-people-dialog/add-people-dialog.component';
import { ChannelMembersComponent } from '../channel-members/channel-members.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { ChannelHelper } from 'src/moduls/channelHelper.class';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent {
  public textThread = "";
  public textEdit = ""
  showEmojis: boolean | undefined;
  showEmojisTread: boolean | undefined;
  public chathelper: ChatHepler = new ChatHepler();
  private threadIndex: number = 0;
  private commIndex: number = 0;
  public editChannelOpen: boolean | false;
  public addPeopleOpen: boolean | false;
  public channelMembersOpen: boolean | false;
  public openEditDialog: boolean = false;
  public smileEdit = false;
  @Input() number: number = 0;
  @Input() threadList: any[] = [this.chathelper.createEmptyThread()];
  @Input() user: User = new User();//authenticated user
  @Input() userList: User[];
  @Input() sideMenuHidden: boolean;
  @Input() openChat: boolean;
  @Input() screenWidth: number;
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  @Output() newItemEventChannel = new EventEmitter<ThreadConnector>();
  @Output() isOpen = new EventEmitter<boolean>();
  public smileHelper: SmileHelper = new SmileHelper();
  public channelHelper: ChannelHelper = new ChannelHelper()

  private dialogClasses: Array<string> = ['dialogBorToLeNone']; 
  public addresses = false;
  private text: string = "";
  public popUpText = { "du": "", "first": "", "other": "", "verb": "" };
  private cA: any;

  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() areaTextPrivate = new EventEmitter<string>();


  constructor(public dialog: MatDialog) {
    setTimeout(() => {
      this.cA = (document.getElementById("channelBody") as HTMLInputElement | null);
      this.cA.scrollTo({ top: this.cA.scrollHeight, behavior: 'smooth' });
    }, 1000);
  }

  scrollDown() {
    setTimeout(() => {
      this.cA.scrollTo({ top: this.cA.scrollHeight, behavior: 'smooth' });
    }, 1500);
  }

  /**
   * Openes the dialog for editing the Channel
   */
  openEditChannelDialog() {
    this.channelHelper.setEditChanPos(this.sideMenuHidden);
    this.setEditDialogMobileStyle();

    this.toggleEditChanBol();
    let dialogRef = this.dialog.open(EditChannelComponent,
      { panelClass: this.dialogClasses, position: { left: this.channelHelper.editChanPosLeft, top: this.channelHelper.dialogPosTop } });
    dialogRef = this.channelHelper.setValuesToEditDialog(dialogRef, this.threadList, this.number, this.userList, this.user, this.screenWidth);
    dialogRef.afterClosed().subscribe(() => {
      this.toggleEditChanBol();
    });
  }

  showBegin(com: any) {
    return com.date == "";
  }

  setEditDialogMobileStyle() {
    if (this.mobileScreenWidth()) {
      this.channelHelper.editChanPosLeft = '0px';
      this.channelHelper.dialogPosTop = '0px';
      this.dialogClasses = ['maxWidth100', 'dialogBorRadNone'];
    }
  }

  /**
   * Sets the Position of channel-members-dialog and add-people-dialog,
   * depending on whether side-menu-thread(==openChat), is open or closed.
   */
  setPositionOfDialogs() {
    this.channelHelper.setPositionOfDialogs(this.openChat, this.mobileScreenWidth());

  }

  toggleEditChanBol() {
    this.editChannelOpen = !this.editChannelOpen;
  }

  /**
   * Stores a given information as JSON at the given position
   * 
   * @param index Index of the message within the day
   * @param n     What kind of information do we want to acces?
   * @param m     Information we want to store
   */
  setTreadData(index: number, n: string, m: any) {
    this.threadList[this.number].communikation[this.commIndex].threads[index][n] = m;
  }

  /**
 * Return the information as JSON that is stored at the given position
 * 
 * @param index Index of the message within the day
 * @param n     What kind of information do we want to acces? 
 */
  getTreadData(index: number, n: string) {
    return this.threadList[this.number].communikation[this.commIndex].threads[index][n];
  }

  /**
   * Removes the Comment-Smilie at the given position. Structure of Threadbase communikation see ChatHelper.
   * 
   * @param cIndex  Index of the communication
   * @param tIndex  Index of the Message that belongs to this communication
   * @param sIndex  Index of the Smile
   */
  removeSmileComment(cIndex: number, tIndex: number, sIndex: number) {
    let threadId = this.threadList[this.number].channel.idDB;
    this.commIndex = cIndex;
    let userSmiles = this.getTreadData(tIndex, 'smile');
    let newUserList = this.smileHelper.removeUser(userSmiles[tIndex].users, this.user)
    userSmiles[sIndex].users = newUserList;
    if (userSmiles[sIndex].users.length == 0) {
      userSmiles.splice(sIndex, 1);
    }
    this.setTreadData(tIndex, 'smile', userSmiles);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.number].communikation });
  }

  /**
   * stors the given emoji   * 
   * @param e JSON of the emoji
   */
  saveEmojiComment(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.saveEmojiCommentHelper(emoji);
    this.showEmojisTread = !this.showEmojisTread;
  }

  saveEmojiCommentHelper(emoji: any) {
    let threadId = this.threadList[this.number].channel.idDB;
    let sm = this.channelHelper.createEmojiData(emoji,this.getTreadData(this.threadIndex, 'smile'),this.smileHelper,this.user);
    this.setTreadData(this.threadIndex, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.number].communikation });
  }

  /**
   * stors the specific emoji, Claps or Checkmark    
   * @param e JSON of the emoji
   */
  saveEmojiCom(cIndex: number, tIndex: number, e: any) { // warum speichert die funktion den emoji nicht?   
    this.setIndices(cIndex, tIndex);
    this.saveEmojiCommentHelper(e);
  }

  toggleEmojisDialog() {
    this.showEmojis = !this.showEmojis;
  }

  /** 
   * @param thread JSON that contains the information of the thread.
   * @returns      Time from the last answer of this message.
   */
  getTimeLastAnswer(thread: any) {
    let lastIndex = thread.answer.length - 1;
    if (lastIndex == -1) { return 0; }
    return thread.answer[lastIndex].time;
  }

  /**
   * Opens the threads/answers of the message with the given location Lada.
   * 
   * @param n Channel-Index
   * @param i Communication-Index
   * @param j Message-Index
   */
  openThisThread(n: number, i: number, j: number) {
    this.threadC.setValue(n, i, j);
    this.newItemEventChannel.emit(this.threadC);
  }

  /**   
   * @param thread JSON that contains the information of the thread.
   * @returns      is the message from the currently logged in user (important for Styling)
   */
  fromLoggedInUser(thread: any) {
    let uId = this.user.idDB;
    let aId = thread.iD;
    return (uId == aId);
  }

  /**
   * 
   * @param id id of the user for which we want the path of the Profile-Image
   * @returns 
   */
  getIconPathQuestionUser(id: string) {

    let path = "";
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path = u.iconPath;
      }
    });
    if (this.user.idDB == id) { path = this.user.iconPath; }
    return path;
  }

  /**
   * Send a Question 
   * @param indexCannel index it the channel in that the question shell be released.
   */
  sendQuestion(indexCannel: number) {
    let communikationLastIndex = this.threadList[indexCannel].communikation.length - 1;
    let lastdate = this.threadList[indexCannel].communikation[communikationLastIndex].date;
    let today = this.chathelper.parseDate(new Date(Date.now()));
    let threadId = this.threadList[indexCannel].channel.idDB;
    let question = this.channelHelper.getQuestion(this.user, this.chathelper, this.textThread, this.userList)
    if (today == lastdate) {
      this.threadList[indexCannel].communikation[communikationLastIndex].threads.push(question);
      let th = this.threadList[indexCannel].communikation;
      this.chathelper.updateDB(threadId, "thread", { "communikation": th });
    }
    else {
      if (this.threadList[indexCannel].communikation[communikationLastIndex].date == "") {
        this.threadList[indexCannel].communikation = [];
      }
      let c = {
        "date": today,
        "threads": [question]
      }
      this.threadList[indexCannel].communikation.push(c);
      this.chathelper.updateDB(threadId, "thread", { "communikation": this.threadList[indexCannel].communikation });
    }
    this.textThread = "";
  }

  setIndices(cIndex: number, tIndex: number) {
    this.threadIndex = tIndex;
    this.commIndex = cIndex;
  }
  /**
   * Stores the given Data in Variables
   * @param cIndex Communication-Index
   * @param tIndex ThreadIndex
   */
  toggleEmojisThread(cIndex: number, tIndex: number) {
    this.showEmojisTread = !this.showEmojisTread;
    this.threadIndex = tIndex;
    this.commIndex = cIndex;
  }
  isThreadEmojiShown(cIndex: number, tIndex: number) {
    return ((this.showEmojisTread) && (this.threadIndex == tIndex) && (this.commIndex == cIndex));
  }

  /**
   * Opends the dialog for adding peopple to the Channel.
   */
  openAddPeopleDialog() {
    this.toggleAddPplChanBol();
    this.setPositionOfDialogs();
    let dialogRef = this.dialog.open(AddPeopleDialogComponent);
    dialogRef.componentInstance.channel = this.threadList[this.number];
    dialogRef.componentInstance.userList = this.userList;
    dialogRef.componentInstance.user = this.user;
    this.setAddPplDialogPos(dialogRef);
    this.setAddPplDialogValues(dialogRef);
    this.subscribeAddPplDialog(dialogRef);

  }

  //Bitte kommentieren
  setAddPplDialogPos(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.addPanelClass('dialogBorToReNone');
    if (this.mobileScreenWidth()) {
      dialogRef.addPanelClass('maxWidth100');
      return;
    }
    dialogRef.updatePosition({ right: this.channelHelper.addMembersDialogPosRight, top: this.channelHelper.dialogPosTop });
  }

  //Bitte kommentieren
  setAddPplDialogValues(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    let instance = dialogRef.componentInstance;
    instance.user = new User(this.user.toJSON());
    instance.channel = this.threadList[this.number].channel;
    instance.userList = this.userList;
    instance.screenWidth = this.screenWidth;
  }

  //Bitte kommentieren
  subscribeAddPplDialog(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.toggleAddPplChanBol();
    })
  }

  toggleAddPplChanBol() {
    this.addPeopleOpen = !this.addPeopleOpen;
  }

  /** 
   * @param m JSON of data of a Channel-Message
   * @returns Returns wheather the person that wrote the message is the current user. Important for styling.
   */
  getFlip(m: any) {
    return m.iD == this.user.idDB;
  }

  closeEdit(m: any) {
    m.edit = false;
  }
  /**
   * Save the Edited message 
   * @param m JSON of data of a Channel-Message
   * @param cIndex  Communication-Index
   * @param tIndex  ThreadIndex
   */
  saveEdit(m: any, cIndex: number, tIndex: number) {
    m.edit = false;
    this.threadList[this.number].communikation[cIndex].threads[tIndex].message = this.textEdit;
    this.threadList[this.number].communikation[cIndex].threads[tIndex].messageSplits = this.chathelper.getLinkedUsers(this.user, this.userList, this.textEdit);
    let threadIndex = this.threadList[this.number].channel.idDB;
    this.chathelper.updateDB(threadIndex, 'thread', { "communikation": this.threadList[this.number].communikation });
  }

  /**
   * Sets variable to the given values. Opens the edit-dialog Window.
   * @param cIndex  Communication-Index
   * @param tIndex  ThreadIndex 
   */
  toggleEmojisDialogEdit(cIndex: number, tIndex: number) {
    this.threadIndex = tIndex;
    this.commIndex = cIndex;
    this.smileEdit = !this.smileEdit;
  }

  /** * 
 * @param e JSON of the emoji that should be shown in the message within the channel
 */
  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.textThread += emoji;
    this.toggleEmojisDialog();
  }

  /** * 
 * @param e JSON of the emoji that should be shown in the message-edit within the channel
 */
  saveEmojiEdit(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.textEdit += emoji;
    this.smileEdit = !this.smileEdit;
  }

  /**Stope the default function when clicking on enter
   * 
   * @param input Key event
   */
  keyDownFunction(input: any) {

    if (input.key == "Enter" && !input.shiftKey) {
      input.preventDefault();
      this.sendQuestion(this.number);
    }
  }

  /**    
   * @param m JSON of data of a Channel-Message
   */
  openEditWindow(m: any) {
    this.openEditDialog = !this.openEditDialog;
    m.edit = true;
    this.textEdit = m.message;
  }

  /**
   * Blend in the popUp containing "Nachricht bearbeiten"
   */
  openEditPopUp() {
    this.openEditDialog = !this.openEditDialog;
  }

  /**
   * Opens a window with all users that are assigned to the channel.
   */
  openChannelMembersDialog() {
    this.toggleChannelMembersBol();
    this.setPositionOfDialogs();
    let dialogRef = this.dialog.open(ChannelMembersComponent);
    this.setChannelMembersDialogPos(dialogRef);
    this.setChannelMembersValues(dialogRef);
    this.subscribeChannelMembersDialog(dialogRef);    
  }
  /**
   * sets the position of the Dialog that contains all assigned members.
   */
  setChannelMembersDialogPos(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    dialogRef.addPanelClass('dialogBorToReNone');
    if (this.mobileScreenWidth())
      return;
    dialogRef.updatePosition({ right: this.channelHelper.membersDialogPosRight, top: this.channelHelper.dialogPosTop });
  }
  /**
   * Gives the needet variables to the Dialog
   * @param dialogRef MatDialogRef of ChannelMembersComponent
   */
  setChannelMembersValues(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    console.log("members");
    this.channelHelper.setChannelMembersValues(dialogRef, this.user, this.threadList, this.number, this.userList);
  }

  /**
   * Open add-people-dialog if User click on the Button add-people, in channel-members-dialog.
   * Also toggle´s the Boolean channelMembersOpen.
   * @param dialogRef Reference of Mat Dialog, from channel-members.component.
   */
  subscribeChannelMembersDialog(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openAddPeopleDialog();
      }
      this.toggleChannelMembersBol();
    })
  }

  toggleChannelMembersBol() {
    this.channelMembersOpen = !this.channelMembersOpen;
  }

  openMailAddresses() {
    this.addresses = !this.addresses;
  }

  openProfileOfUser(user: any) {    
    let t = user.text.substring(1);
    if (this.user.name == t) { this.openDialog(this.user) }
    else {
      this.userList.forEach((u) => {
        if (u.name == t) { this.openDialog(u); }
      });
    }
  }

  chooseUser(u: User) {
    this.textThread += '@' + u.name;
    this.addresses = !this.addresses;
  }

  openDialog(user: User): void {
    const dialogRef = this.dialog.open(UserProfileComponent);
    dialogRef.componentInstance.user = new User(user.toJSON());
    dialogRef.componentInstance.ref = dialogRef;
    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        this.callOpenT(user);
      }
    });
  }

  callOpenT(u: User) {
    this.callOpenTalk.emit(u);
    this.isOpen.emit(false);
    this.areaTextPrivate.emit(this.text);
  }

  mobileScreenWidth() {
    return this.screenWidth < 830;
  }

  /**
   * Blends in a PopUp up window with the emoji icon and the people that commented the message with the emoji
   * @param i Index of the communication
   * @param j Index of the tread
   * @param sIndex  Index of the smile
   */
  showPopUpCommentUsers(i: number, j: number, sIndex: number) {
    let smile = this.threadList[this.number].communikation[i].threads[j].smile[sIndex];
    let smileUsers = [];
    smile.users.forEach((s) => {
      smileUsers.push(s.id);
    });
    this.popUpText = this.smileHelper.showPopUpCommentUsers(smileUsers, this.user, this.userList);
  }

  showBlendin(attr: string) {
    return this.popUpText[attr] != "";
  }

}
