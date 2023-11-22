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
  private dialogPosTop: string = '215px';
  private editChanPosLeft: string = '445px';
  private membersDialogPosRight: string = '110px';
  private addMembersDialogPosRight: string = '60px';
  private dialogClasses: Array<string> = ['dialogBorToLeNone'];
  public openEditDialog: boolean = false;
  public addresses = false;
  private text: string = "";
  public popUpText = { "du": "", "first": "", "other": "" ,"verb":""}

  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() areaTextPrivate = new EventEmitter<string>();


  constructor(public dialog: MatDialog) {   
  }

  /**
   * Openes the dialog for editing the Channel
   */
  openEditChannelDialog() {
    this.setEditChanPos();
    this.setEditDialogMobileStyle();

    this.toggleEditChanBol();
    let dialogRef = this.dialog.open(EditChannelComponent,
      { panelClass: this.dialogClasses, position: { left: this.editChanPosLeft, top: this.dialogPosTop } });
    dialogRef.componentInstance.channel = this.threadList[this.number].channel;//Kopie
    dialogRef.componentInstance.userList = this.userList;//Kopie
    dialogRef.componentInstance.user = this.user;//Kopie
    dialogRef.componentInstance.screenWidth = this.screenWidth;
    dialogRef.afterClosed().subscribe(() => {
      this.toggleEditChanBol();
    });
  }


  showBegin(com: any) {
    return com.date == "";
  }


  /**
   * Sets the position of the edit channel Window
   * depending on whether side-menu(==sideMenuHidden), is open or closed.
   */
  setEditChanPos() {
    if (this.sideMenuHidden) {
      this.editChanPosLeft = '60px';
    } else {
      this.editChanPosLeft = '445px';
    }
  }


  setEditDialogMobileStyle() {
    if (this.mobileScreenWidth()) {
      this.editChanPosLeft = '0px';
      this.dialogPosTop = '0px';
      this.dialogClasses = ['maxWidth100', 'dialogBorRadNone'];
    }
  }

  /**
   * Sets the Position of channel-members-dialog and add-people-dialog,
   * depending on whether side-menu-thread(==openChat), is open or closed.
   */
  setPositionOfDialogs() {
    if (this.openChat) {
      this.membersDialogPosRight = '615px';
      this.addMembersDialogPosRight = '565px';
    } else {
      this.membersDialogPosRight = '110px';
      this.addMembersDialogPosRight = '60px';
    }
    this.setPositionOfDialogsMobile();
  }


  /**
   * Sets the Position of channel-members-dialog and add-people-dialog,
   * depending on screenWidth.
   */
  setPositionOfDialogsMobile() {
    if (this.mobileScreenWidth()) {
      this.membersDialogPosRight = '0px';
      this.addMembersDialogPosRight = '0px';
      this.dialogPosTop = '0px';
    }
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
   * stors the given emoji
   * 
   * @param e JSON of the emoji
   */
  saveEmojiComment(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    let threadId = this.threadList[this.number].channel.idDB;

    let sm = this.createEmojiData(emoji);

    this.setTreadData(this.threadIndex, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.number].communikation });
    this.showEmojisTread = !this.showEmojisTread;
  }

  /**
   * stors the specific emoji, Claps or Checkmark
   * 
   * @param e JSON of the emoji
   */
  saveEmojiCom(cIndex: number, tIndex: number, e: any) { // warum speichert die funktion den emoji nicht?

    let emoji = e;
    this.setIndices(cIndex, tIndex);
    let threadId = this.threadList[this.number].channel.idDB;
    let sm = this.createEmojiData(emoji);

    this.setTreadData(this.threadIndex, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.number].communikation });
    // this.showEmojisTread = !this.showEmojisTread;
  }

  /**
   * Creates the emoji data, that shell be stored.
   */
  createEmojiData(emoji: string) {
    let sm = this.getTreadData(this.threadIndex, 'smile');

    let smileIndex = this.smileHelper.smileInAnswer(emoji, sm);
    if (smileIndex == -1) {
      let icon = {
        "icon": emoji,
        "users": [
          { "id": this.user.idDB }
        ]
      };
      sm.push(icon);
    } else {
      let usersIcon = sm[smileIndex].users;

      if (!this.smileHelper.isUserInSmile(usersIcon, this.user)) {
        sm[smileIndex].users.push({ "id": this.user.idDB });
      }
    }
    return sm;
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
   * 
   * @returns Creates a new Question as JSON
   */
  getQuestion() {
    let question = {
      "name": this.user.name,
      "iD": this.user.idDB, //of person that writes the message
      "edit": false,
      "smile": [],
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "message": this.textThread,
      "messageSplits": this.chathelper.getLinkedUsers(this.user, this.userList, this.textThread),
      "answer": []
    }
    return question;
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
    let question = this.getQuestion();
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
    dialogRef.updatePosition({ right: this.addMembersDialogPosRight, top: this.dialogPosTop });
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
   * 
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
    dialogRef.componentInstance.channel = this.threadList[this.number].channel;//Kopie
    dialogRef.componentInstance.userList = this.userList;//Kopie
    dialogRef.componentInstance.user = this.user;//Kopie

  }
  /**
   * sets the position of the Dialog that contains all assigned members.
   */
  setChannelMembersDialogPos(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    dialogRef.addPanelClass('dialogBorToReNone');
    if (this.mobileScreenWidth())
      return;
    dialogRef.updatePosition({ right: this.membersDialogPosRight, top: this.dialogPosTop });
  }


  /**
   * Goves the needet variables to the Dialog
   * @param dialogRef MatDialogRef of ChannelMembersComponent
   */
  setChannelMembersValues(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    let instance = dialogRef.componentInstance;
    instance.user = new User(this.user.toJSON());
    instance.channel = this.threadList[this.number].channel;
    instance.userList = this.userList;
    instance.dialogRef = dialogRef;
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

  // /** 
  //    * @param index index of the answer
  //    * @returns     returns the list of commenticons of the answer
  //    */
  // showSmilie(index: number) {
  //   return 0 != this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index].smile;
  // }
  showPopUpCommentUsers(i: number, j: number, sIndex: number) {    
  
    let smile = this.threadList[this.number].communikation[i].threads[j].smile[sIndex];
    let smileUsers = [];      
    smile.users.forEach((s) => {
      smileUsers.push(s.id);
    });
    
    // let threadSmile = this.threadList[this.number].communikation[i].threads[j].smile;
    // let smileUsers = [];    
    // threadSmile.forEach((t) => {
    //   t.users.forEach((s) => {
    //     if(smileUsers.indexOf(s.id)==-1)
    //     {smileUsers.push(s.id);}
    //   }); 
    // });  
   
    this.popUpText =this.smileHelper.showPopUpCommentUsers(smileUsers,this.user,this.userList); 
   
  }

  showBlendin(attr:string){
  return this.popUpText[attr]!="";
  }
 
}
