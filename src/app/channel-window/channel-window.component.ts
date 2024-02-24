import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, } from '@angular/core';
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
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent implements OnDestroy {
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
  @Input() channelNumber: number = 0;
  @Input() threadList: any[] = [this.chathelper.createEmptyThread()];
  @Input() user: User = new User();
  @Input() userList: User[];
  @Input() sideMenuHidden: boolean;
  @Input() threadOpen: boolean;
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  @Output() newItemEventChannel = new EventEmitter<ThreadConnector>();
  @Output() isOpen = new EventEmitter<boolean>();
  public smileHelper: SmileHelper = new SmileHelper();
  public channelHelper: ChannelHelper = new ChannelHelper()

  private dialogEditChanClasses: Array<string> =
    ['dialogBorToLeNone', 'maxWidth100', 'dialogBorRadNone', 'dialogMarginMiddle', 'dialogMarginNone'];
  public addresses = false;
  private text: string = "";
  public popUpText = { "du": "", "first": "", "other": "", "verb": "" };
  public dataUpload = { "link": "", "title": "" };
  private upload: any;
  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() areaTextPrivate = new EventEmitter<string>();

  @ViewChild('channelBody') channelBody: ElementRef;
  public clickInsideEmoji = false;
  constructor(public dialog: MatDialog, public screen: ScreenService) {
    setTimeout(() => {
      this.upload = (document.getElementById("img") as HTMLInputElement | null);
    }, 500);
  }


  /**
   * Scrolls to the end of the channel window
   */
  scrollDown() {
    setTimeout(() => {
      if (this.channelBody) {
        this.channelBody.nativeElement.scrollTo({ top: this.channelBody.nativeElement.clientHeight, behavior: 'smooth' });
      }
    }, 300);
  }

  /**
   * Openes the dialog for editing the Channel
   */
  openEditChannelDialog() {
    this.channelHelper.setEditChanPos(this.sideMenuHidden);
    this.toggleEditChanBol();
    let dialogRef = this.dialog.open(EditChannelComponent,
      { panelClass: this.dialogEditChanClasses, position: { left: this.channelHelper.editChanPosLeft, top: this.channelHelper.dialogPosTop } });
    dialogRef = this.channelHelper.setValuesToEditDialog(dialogRef, this.threadList, this.channelNumber, this.userList, this.user);
    dialogRef.afterClosed().subscribe(() => {
      this.toggleEditChanBol();
    });
  }

  showBegin(com: any) {
    return com.date == "";
  }

  /**
   * Sets the Position of channel-members-dialog and add-people-dialog,
   * depending on whether side-menu-thread(==threadOpen), is open or closed.
   */
  setPositionOfDialogs() {
    this.channelHelper.setPositionOfDialogs(this.threadOpen, this.screen.mobileScreenWidth());

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
    this.threadList[this.channelNumber].communikation[this.commIndex].threads[index][n] = m;
  }

  /**
 * Return the information as JSON that is stored at the given position
 * 
 * @param index Index of the message within the day
 * @param n     What kind of information do we want to acces? 
 */
  getTreadData(index: number, n: string) {
    return this.threadList[this.channelNumber].communikation[this.commIndex].threads[index][n];
  }

  /**
   * Removes the Comment-Smilie at the given position. Structure of Threadbase communikation see ChatHelper.
   * 
   * @param cIndex  Index of the communication
   * @param tIndex  Index of the Message that belongs to this communication
   * @param sIndex  Index of the Smile
   */
  removeSmileComment(cIndex: number, tIndex: number, sIndex: number) {
    let threadId = this.threadList[this.channelNumber].channel.idDB;
    this.commIndex = cIndex;
    let userSmiles = this.getTreadData(tIndex, 'smile');
    let newUserList = this.smileHelper.removeUser(userSmiles[sIndex].users, this.user)
    userSmiles[sIndex].users = newUserList;
    if (userSmiles[sIndex].users.length == 0) {
      userSmiles.splice(sIndex, 1);
    }
    this.setTreadData(tIndex, 'smile', userSmiles);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.channelNumber].communikation });
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
    let threadId = this.threadList[this.channelNumber].channel.idDB;
    let sm = this.channelHelper.createEmojiData(emoji, this.getTreadData(this.threadIndex, 'smile'), this.smileHelper, this.user);
    this.setTreadData(this.threadIndex, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.channelNumber].communikation });
  }

  /**
   * stors the specific emoji, Claps or Checkmark    
   * @param e JSON of the emoji
   */
  saveEmojiCom(cIndex: number, tIndex: number, e: any) { // warum speichert die funktion den emoji nicht?   
    this.setIndices(cIndex, tIndex);
    this.saveEmojiCommentHelper(e);
  }

  toggleEmojisDialog(event: any) {
    event.stopPropagation();
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
    let question = this.channelHelper.getQuestion(this.user, this.chathelper, this.textThread, this.userList, this.dataUpload)
    if (question.message == "" && question.url.link == "") { return; }
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
  toggleEmojisThread(event: any, cIndex: number, tIndex: number) {
    event.stopPropagation();
    this.showEmojisTread = !this.showEmojisTread;
    this.threadIndex = tIndex;
    this.commIndex = cIndex;
  }
  isThreadEmojiShown(cIndex: number, tIndex: number) {
    return ((this.showEmojisTread) && (this.threadIndex == tIndex) && (this.commIndex == cIndex));
  }

  noEmoji() {
    if (this.clickInsideEmoji) {
      this.clickInsideEmoji = false;
      return;
    }
    if (this.showEmojisTread)
      this.showEmojisTread = false;
    if (this.showEmojis)
      this.showEmojis = false;
    if (this.smileEdit)
      this.smileEdit = false;
  }

  clickedInsideEmojiMart() {
    this.clickInsideEmoji = true;
  }

  /**
   * Opends the dialog for adding peopple to the Channel.
   */
  openAddPeopleDialog() {
    this.toggleAddPplChanBol();
    this.setPositionOfDialogs();
    let dialogRef = this.dialog.open(AddPeopleDialogComponent);
    this.setAddPplDialogPos(dialogRef);
    this.setAddPplDialogValues(dialogRef);
    this.subscribeAddPplDialog(dialogRef);
  }

  /**
   * Sets the Position of the MatDialog.
   * 
   * @param dialogRef Reference of the given MatDialog
   * @returns to stop function from propagation, if the App is in Mobile mode
   */
  setAddPplDialogPos(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.addPanelClass('dialogBorToReNone');
    if (this.screen.mobileScreenWidth()) {
      dialogRef.addPanelClass('maxWidth100');
      return;
    }
    dialogRef.updatePosition({ right: this.channelHelper.addMembersDialogPosRight, top: this.channelHelper.dialogPosTop });
  }


  setAddPplDialogValues(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    let instance = dialogRef.componentInstance;
    instance.user = new User(this.user.toJSON());
    instance.channel = this.threadList[this.channelNumber].channel;
    instance.userList = this.userList;
  }

  /**
   *after the the given MatDialog is closed, this function call toggleAddPplChanBol()
   *  
   * @param dialogRef Reference of the given MatDialog
   */
  subscribeAddPplDialog(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.toggleAddPplChanBol();
    })
  }


  /**
   *toggles the addPeopleOpen boolean
   */
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
    this.threadList[this.channelNumber].communikation[cIndex].threads[tIndex].message = this.textEdit;
    this.threadList[this.channelNumber].communikation[cIndex].threads[tIndex].messageSplits = this.chathelper.getLinkedUsers(this.user, this.userList, this.textEdit);
    let threadIndex = this.threadList[this.channelNumber].channel.idDB;
    if (this.textEdit == "" && this.threadList[this.channelNumber].communikation[cIndex].threads[tIndex].url.link == "") {
      this.channelHelper.deleteMessage(this.channelNumber, cIndex, tIndex, this.threadList);
    } else {
      this.chathelper.updateDB(threadIndex, 'thread', { "communikation": this.threadList[this.channelNumber].communikation });
    }
  }

  /**
   * Sets variable to the given values. Opens the edit-dialog Window.
   * @param cIndex  Communication-Index
   * @param tIndex  ThreadIndex 
   */
  toggleEmojisDialogEdit(event: any, cIndex: number, tIndex: number) {
    event.stopPropagation();
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
    this.showEmojis = !this.showEmojis;
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
      this.sendQuestion(this.channelNumber);
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
  toggleEditPopUp() {
    this.openEditDialog = !this.openEditDialog;
  }

  closeEditPopUp() {
    if (this.openEditDialog) {
      this.openEditDialog = false;
    }
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
    if (this.screen.mobileScreenWidth())
      return;
    dialogRef.updatePosition({ right: this.channelHelper.membersDialogPosRight, top: this.channelHelper.dialogPosTop });
  }
  /**
   * Gives the needet variables to the Dialog
   * @param dialogRef MatDialogRef of ChannelMembersComponent
   */
  setChannelMembersValues(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    this.channelHelper.setChannelMembersValues(dialogRef, this.user, this.threadList, this.channelNumber, this.userList);
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
  /**
   * Opens the dialog of the given
   * @param user 
   */
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

  /**
   * Blends in a PopUp up window with the emoji icon and the people that commented the message with the emoji
   * @param i Index of the communication
   * @param j Index of the tread
   * @param sIndex  Index of the smile
   */
  showPopUpCommentUsers(i: number, j: number, sIndex: number) {
    let smile = this.threadList[this.channelNumber].communikation[i].threads[j].smile[sIndex];
    let smileUsers = [];
    smile.users.forEach((s) => {
      smileUsers.push(s.id);
    });
    this.popUpText = this.smileHelper.showPopUpCommentUsers(smileUsers, this.user, this.userList);
  }

  showBlendin(attr: string) {
    return this.popUpText[attr] != "";
  }

  showBlendIn() {
    return this.dataUpload.link != "";
  }

  /**
 * Saves the uploaded portrait.
 * @param event Uploaded file
 */
  async onSelect(event: any) {
    await this.chathelper.onSelect(event, this.dataUpload);
    this.upload.value = "";
  }

  showLink(link: string) {
    return link != "";
  }

  closeUpload() {
    this.chathelper.deleteFileFromStorage(this.dataUpload.title);
    this.dataUpload.link = "";
    this.dataUpload.title = "";
  }

  deleteMessage(number: number, i: number, j: number) {
    this.openEditDialog = false;
    this.channelHelper.deleteMessage(number, i, j, this.threadList);
  }

  /**
   * Deletes the uploaded file from a channel message
   * @param e Event
   * @param i  communication index
   * @param j   thread index
   */
  deleteUp(e: any, i: number, j: number) {
    e.preventDefault();
    this.channelHelper.deleteUp(this.channelNumber, i, j, this.threadList);
  }


  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
