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
  public channelMessage: string = "";
  public channelMessageEdit: string = ""
  public chathelper: ChatHepler = new ChatHepler();
  private channelIndex: number = 0;
  private commIndex: number = 0;
  @Input() channelNumber: number = 0;
  @Input() channelList: any[] = [this.chathelper.createEmptyThread()];
  @Input() user: User = new User();
  @Input() userList: Array<User> = [];
  @Input() sideMenuHidden: boolean;
  @Input() threadOpen: boolean;
  @Output() newItemEventChannel = new EventEmitter<ThreadConnector>();
  @Output() isOpen = new EventEmitter<boolean>();
  public smileHelper: SmileHelper = new SmileHelper();
  public channelHelper: ChannelHelper = new ChannelHelper();
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  private text: string = "";
  public popUpText: any = { "du": "", "first": "", "other": "", "verb": "" };
  public dataUpload: any = { "link": "", "title": "" };
  private upload: any;
  public addressBoxOpen: boolean = false;
  public editChannelOpen: boolean = false;
  public addPeopleOpen: boolean = false;
  public channelMembersOpen: boolean = false;
  public openEditDialog: boolean = false;
  public showEmojis: boolean = false;
  public showEmojisEdit: boolean = false;
  public showEmojisTread: boolean = false;
  private clickInsideEmoji: boolean = false;
  private clickInsideAddressBox: boolean = false;

  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() areaTextPrivate = new EventEmitter<string>();
  @ViewChild('channelBody') channelBody: ElementRef;

  constructor(public dialog: MatDialog, public screen: ScreenService) {
    setTimeout(() => {
      this.upload = (document.getElementById("img") as HTMLInputElement | null);
    }, 500);
  }


  /**
   * Scrolls to the end of the channel window
   */
  scrollDown() {
    this.channelBody.nativeElement.scrollTo({ top: this.channelBody.nativeElement.scrollHeight, behavior: 'smooth' });
  }


  /**
   * Removes the Comment-Smilie at the given position. Structure of Threadbase communikation see ChatHelper.
   * @param {number} cIndex  Index of the communication
   * @param {number} tIndex  Index of the Message that belongs to this communication
   * @param {number} sIndex  Index of the Smile
   */
  removeSmileComment(cIndex: number, tIndex: number, sIndex: number) {
    let threadId = this.getThreadId();
    this.commIndex = cIndex;
    let userSmiles = this.getThreadData(tIndex, 'smile');
    let newUserList = this.smileHelper.removeUser(userSmiles[sIndex].users, this.user)
    userSmiles[sIndex].users = newUserList;
    this.deleteSmileyIfNoUsers(userSmiles, sIndex);
    this.setThreadData(tIndex, 'smile', userSmiles);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.channelList[this.channelNumber].communikation });
  }


  /**
   * deletes the Smiley JSON if it has no users anymore
   * @param {Array} userSmiles 
   * @param {number} sIndex 
   */
  deleteSmileyIfNoUsers(userSmiles: any[], sIndex: number) {
    if (userSmiles[sIndex].users.length == 0) {
      userSmiles.splice(sIndex, 1);
    }
  }


  /**
   * stores the given emoji
   * @param e JSON of the emoji
   */
  saveEmojiComment(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.saveEmojiCommentHelper(emoji);
    this.toggleEmojisThread(event);
  }


  saveEmojiCommentHelper(emoji: any) {
    let threadId = this.getThreadId();
    let sm = this.channelHelper.createEmojiData(emoji, this.getThreadData(this.channelIndex, 'smile'), this.smileHelper, this.user);
    this.setThreadData(this.channelIndex, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.channelList[this.channelNumber].communikation });
  }


  getThreadId() {
    return this.channelList[this.channelNumber].channel.idDB;
  }


  /**
 * Return the information as JSON that is stored at the given position
 * 
 * @param index Index of the message within the day
 * @param n     What kind of information do we want to acces? 
 */
  getThreadData(index: number, n: string) {
    return this.channelList[this.channelNumber].communikation[this.commIndex].threads[index][n];
  }


  /**
     * Stores a given information as JSON at the given position
     * 
     * @param index Index of the message within the day
     * @param n     What kind of information do we want to acces?
     * @param m     Information we want to store
     */
  setThreadData(index: number, n: string, m: any) {
    this.channelList[this.channelNumber].communikation[this.commIndex].threads[index][n] = m;
  }


  /**
   * stors the specific emoji, Claps or Checkmark    
   * @param e JSON of the emoji
   */
  saveEmojiCom(cIndex: number, tIndex: number, e: any) { // warum speichert die funktion den emoji nicht?   
    this.setIndices(cIndex, tIndex);
    this.saveEmojiCommentHelper(e);
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
    if (this.userList.length > 0) {//if abfrage fürs testing
      this.userList.forEach((u) => {
        if (u.idDB == id) {
          path = u.iconPath;
        }
      });
    }

    if (this.user.idDB == id) { path = this.user.iconPath; }
    return path;
  }


  /**
   * Save a Message
   */
  saveMessage() {
    let commLastIndex = this.channelList[this.channelNumber].communikation.length - 1;
    let lastdate = this.channelList[this.channelNumber].communikation[commLastIndex].date;
    let today = this.chathelper.parseDate(new Date(Date.now()));
    let threadId = this.getThreadId();
    let messageJSON = this.channelHelper.createMessage(this.user, this.chathelper, this.channelMessage, this.userList, this.dataUpload)
    if (this.messageIsEmpty(messageJSON)) { return; }
    this.pushOrCreateNewComm(today, lastdate, commLastIndex, messageJSON, threadId);
    this.channelMessage = "";
  }


  /**
   * returns true of false depending on given message is empty or not
   * @param {JSON} messageJSON 
   * @returns true of false
   */
  messageIsEmpty(messageJSON: { url: any; message: any; }) {
    return messageJSON.message == "" && messageJSON.url.link == "";
  }


  /**
   * add a existing comm or create a new comm,
   * depending on if a comm exist and if it was created today or not
   * @param {string}today 
   * @param {string}lastdate 
   * @param {number}commLastIndex 
   * @param {JSON} messageJSON 
   * @param {string} threadId 
   */
  pushOrCreateNewComm(today: string, lastdate: string, commLastIndex: number, messageJSON: {}, threadId: string) {
    if (today == lastdate) {
      this.addMessageToExistComm(commLastIndex, messageJSON, threadId);
    }
    else {
      this.clearCommsIfFirstMessage(commLastIndex);
      this.createNewDateComm(today, messageJSON, threadId);
    }
  }


  /**
   * add a new message to a existing communication
   * @param {number} commLastIndex 
   * @param {JSON} question 
   * @param {string} threadId 
   */
  async addMessageToExistComm(commLastIndex: number, question: {}, threadId: string) {
    this.channelList[this.channelNumber].communikation[commLastIndex].threads.push(question);
    let th = this.channelList[this.channelNumber].communikation;
    await this.chathelper.updateDB(threadId, "thread", { "communikation": th });
  }


  /**
   * deletes empty communikation from channels communikation Array
   * @param {number} commLastIndex 
   */
  clearCommsIfFirstMessage(commLastIndex: number) {
    if (this.channelList[this.channelNumber].communikation[commLastIndex].date == "") {
      this.channelList[this.channelNumber].communikation = [];
    }
  }


  /**
   * create a new communication
   * @param {string} today 
   * @param {JSON} message 
   * @param {string} threadId 
   */
  async createNewDateComm(today: string, message: {}, threadId: string) {
    let newComm = this.getNewComm(today, message);
    this.channelList[this.channelNumber].communikation.push(newComm);
    await this.chathelper.updateDB(threadId, "thread", { "communikation": this.channelList[this.channelNumber].communikation });
  }


  /**
   * @param {string} today
   * @param {JSON} message 
   * @returns JSON a new Communication with actual date
   */
  getNewComm(today: string, message: {}) {
    return {
      "date": today,
      "threads": [message]
    }
  }


  setIndices(cIndex: number, tIndex: number) {
    this.channelIndex = tIndex;
    this.commIndex = cIndex;
  }


  /**
   * Stores the given Data in Variables
   * @param cIndex Communication-Index
   * @param tIndex ThreadIndex
   */

  isThreadEmojiShown(cIndex: number, tIndex: number) {
    return ((this.showEmojisTread) && (this.channelIndex == tIndex) && (this.commIndex == cIndex));
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
    instance.channel = this.channelList[this.channelNumber].channel;
    instance.userList = this.userList;
  }


  /**
   *after the the given MatDialog is closed, this function call toggleAddPplChanBol()
   * @param dialogRef Reference of the given MatDialog
   */
  subscribeAddPplDialog(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.toggleAddPplChanBol();
    })
  }


  /** 
   * @param m JSON of data of a Channel-Message
   * @returns Returns wheather the person that wrote the message is the current user. Important for styling.
   */
  getFlip(m: any) {
    return m.iD == this.user.idDB;
  }


  closeMessageEdit(m: any) {
    m.edit = false;
  }


  /**
   * Save the Edited message 
   * @param m JSON of data of a Channel-Message
   * @param cIndex  Communication-Index
   * @param tIndex  ThreadIndex
   */
  async saveMessageEdit(m: any, cIndex: number, tIndex: number) {
    m.edit = false;
    this.channelList[this.channelNumber].communikation[cIndex].threads[tIndex].message = this.channelMessageEdit;
    this.channelList[this.channelNumber].communikation[cIndex].threads[tIndex].messageSplits = this.chathelper.getLinkedUsers(this.user, this.userList, this.channelMessageEdit);
    let threadIndex = this.channelList[this.channelNumber].channel.idDB;
    if (this.channelMessageEdit == "" && this.channelList[this.channelNumber].communikation[cIndex].threads[tIndex].url.link == "") {
      this.channelHelper.deleteMessage(this.channelNumber, cIndex, tIndex, this.channelList);
    } else {
      await this.chathelper.updateDB(threadIndex, 'thread', { "communikation": this.channelList[this.channelNumber].communikation });
    }
  }


  /** * 
 * @param e JSON of the emoji that should be shown in the message within the channel
 */
  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.channelMessage += emoji;
    this.toggleEmojisDialog(event);
  }


  /** * 
 * @param e JSON of the emoji that should be shown in the message-edit within the channel
 */
  saveEmojiEdit(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.channelMessageEdit += emoji;
    this.toggleEmojisDialogEdit(event);
  }


  /**Stope the default function when clicking on enter
   * 
   * @param input Key event
   */
  keyDownFunction(input: any) {
    if (input.key == "Enter" && !input.shiftKey) {
      input.preventDefault();
      this.saveMessage();
    }
  }


  /**    
   * @param m JSON of data of a Channel-Message
   */
  openEditWindow(m: any) {
    this.openEditDialog = !this.openEditDialog;
    m.edit = true;
    this.channelMessageEdit = m.message;
  }


  /**
   * makes sure that the editPopUp gets closed if mouseleave the message
   */
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
    this.channelHelper.setChannelMembersValues(dialogRef, this.user, this.channelList, this.channelNumber, this.userList);
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


  /**
   * search for the given user and calls to open his profile in a dialog
   * @param {User} user 
   */
  openProfileOfUser(user: any) {
    let t = user.text.substring(1);
    if (this.user.name == t) { this.openDialog(this.user) }
    else {
      this.userList.forEach((u) => {
        if (u.name == t) { this.openDialog(u); }
      });
    }
  }


  /**
   * add the selected user as a link to the message in textArea
   * @param {User} u 
   */
  chooseUser(u: User) {
    this.channelMessage += '@' + u.name;
    this.toggleAdressBoxOpen();
  }


  /**
   * Opens the dialog of the given User, and opens a talk with that user if in the dialog clicked
   * @param {User} user 
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


  /**
   * Openes the dialog for editing the Channel
   */
  openEditChannelDialog() {
    this.channelHelper.setEditChanPos(this.sideMenuHidden);
    this.toggleEditChanBol();
    let dialogRef = this.setEditChanDialogOpen();
    dialogRef = this.channelHelper.setValuesToEditDialog(dialogRef, this.channelList, this.channelNumber, this.userList, this.user);
    this.subEditDialog(dialogRef);
  }


  /**
   * opens the dialog and set styling attributes
   * @returns MatDialogRef
   */
  setEditChanDialogOpen() {
    return this.dialog.open(
      EditChannelComponent, {
      panelClass: this.channelHelper.dialogEditChanClasses,
      position: {
        left: this.channelHelper.editChanPosLeft, top: this.channelHelper.dialogPosTop
      }
    });
  }


  /**
   * subscribe the dialog that when it closes toggleEditChanBol() gets called
   * @param dialogRef MatDialogRef<EditChannelComponent, any>
   */
  subEditDialog(dialogRef: MatDialogRef<EditChannelComponent, any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.toggleEditChanBol();
    });
  }


  /**
   * emit(share) all needed data to open a talk with the given user
   * @param {User} u 
   */
  callOpenT(u: User) {
    this.callOpenTalk.emit(u);
    this.isOpen.emit(false);
    this.areaTextPrivate.emit(this.text);
  }


  /**
   * Blends in a PopUp up window with the emoji icon and the people that commented the message with the emoji
   * @param {number} i Index of the communication
   * @param {number} j Index of the tread
   * @param {number} sIndex  Index of the smile
   */
  showPopUpCommentUsers(i: number, j: number, sIndex: number) {
    let smile = this.channelList[this.channelNumber].communikation[i].threads[j].smile[sIndex];
    let smileUsers = [];
    smile.users.forEach((s) => {
      smileUsers.push(s.id);
    });
    this.popUpText = this.smileHelper.showPopUpCommentUsers(smileUsers, this.user, this.userList);
  }

  /**
   * returns true if the given attribute in the popUpText is not empty
   * @param {string} attr 
   * @returns true or false
   */
  showBlendin(attr: string) {
    return this.popUpText[attr] != "";
  }


  /**
   * returns true if dataUpload.link is not empty
   * @returns true of false
   */
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
    this.channelHelper.deleteMessage(number, i, j, this.channelList);
  }

  /**
   * Deletes the uploaded file from a channel message
   * @param e Event
   * @param i  communication index
   * @param j   thread index
   */
  deleteUp(e: any, i: number, j: number) {
    e.preventDefault();
    this.channelHelper.deleteUp(this.channelNumber, i, j, this.channelList);
  }


  setAddReactionChannel(event: any, cIndex: number, tIndex: number) {
    this.toggleEmojisThread(event);
    this.channelIndex = tIndex;
    this.commIndex = cIndex;
  }


  /**
    * Sets variable to the given values. Opens the edit-dialog Window.
    * @param cIndex  Communication-Index
    * @param tIndex  ThreadIndex 
    */
  setEmojisDialogEdit(event: any, cIndex: number, tIndex: number) {
    this.toggleEmojisDialogEdit(event);
    this.channelIndex = tIndex;
    this.commIndex = cIndex;
  }


  /**
   * returns true if com.date is a empty string
   * @param com JSON
   * @returns true of false
   */
  showBegin(com: { date: string; }) {
    return com.date == "";
  }


  /**
     * Sets the Position of channel-members-dialog and add-people-dialog,
     * depending on whether side-menu-thread(==threadOpen), is open or closed.
     */
  setPositionOfDialogs() {
    this.channelHelper.setPositionOfDialogs(this.threadOpen, this.screen.mobileScreenWidth());

  }


  closeDialogs() {
    if (this.clickInsideEmoji) {
      this.clickInsideEmoji = false;
      return;
    }
    if (this.clickInsideAddressBox) {
      this.clickInsideAddressBox = false;
      return;
    }

    if (this.showEmojisTread)
      this.showEmojisTread = false;
    if (this.showEmojis)
      this.showEmojis = false;
    if (this.showEmojisEdit)
      this.showEmojisEdit = false;

    if (this.addressBoxOpen) {
      this.addressBoxOpen = false;
    }
  }


  clickedInsideEmojiMart() {
    this.clickInsideEmoji = true;
  }


  clickedInsideAdressBox() {
    this.clickInsideAddressBox = true;
  }


  toggleAdressBoxOpen() {
    this.addressBoxOpen = !this.addressBoxOpen;
  }

  /**
   *toggles the addPeopleOpen boolean
   */
  toggleAddPplChanBol() {
    this.addPeopleOpen = !this.addPeopleOpen;
  }


  toggleChannelMembersBol() {
    this.channelMembersOpen = !this.channelMembersOpen;
  }


  toggleEditChanBol() {
    this.editChannelOpen = !this.editChannelOpen;
  }


  /**
   * Blend in the popUp containing "Nachricht bearbeiten"
   */
  toggleEditPopUp() {
    this.openEditDialog = !this.openEditDialog;
  }


  toggleEmojisDialogEdit(event: any) {
    event.stopPropagation();
    this.showEmojisEdit = !this.showEmojisEdit;
  }


  toggleEmojisDialog(event: any) {
    event.stopPropagation();
    this.showEmojis = !this.showEmojis;
  }


  toggleEmojisThread(event: any) {
    event.stopPropagation();
    this.showEmojisTread = !this.showEmojisTread;
  }


  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

