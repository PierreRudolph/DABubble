import { Component, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { User } from 'src/moduls/user.class';
import { EditChannelComponent } from '../edit-channel/edit-channel.component';
import { SmileHelper } from 'src/moduls/smileHelper.class';
import { AddPeopleDialogComponent } from '../add-people-dialog/add-people-dialog.component';
import { ChannelMembersComponent } from '../channel-members/channel-members.component';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent {
  public textThread = "";
  showEmojis: boolean | undefined;
  showEmojisTread: boolean | undefined;
  private chathelper: ChatHepler = new ChatHepler();
  private threadIndex: number = 0;
  private commIndex: number = 0;
  public editChannelOpen: boolean | false;
  public addPeopleOpen: boolean | false;
  public channelMembersOpen: boolean | false;
  @Input() number: number = 0;
  @Input() threadList: any[] = [this.chathelper.createEmptyThread()];
  @Input() user: User = new User();//authenticated user
  @Input() userList: User[];
  @Input() menuHidden: boolean;
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  @Output() newItemEventChannel = new EventEmitter<ThreadConnector>();
  public smileHelper: SmileHelper = new SmileHelper();
  private editChanPosLeft: string = '445px';
  public openEditDialog: boolean = false;

  constructor(public dialog: MatDialog) {
    console.log("threadlist channel", this.threadList);
    setTimeout(() => {
      console.log("threadlist channel", this.threadList);
    }, 500);
  }

  openEditChannelDialog() {
    this.setEditChanPos();
    this.toggleEditChanBol();
    let dialogRef = this.dialog.open(EditChannelComponent, { panelClass: 'dialogBorToLeNone', position: { left: this.editChanPosLeft, top: '190px' } });
    dialogRef.componentInstance.channel = this.threadList[this.number].channel;//Kopie
    dialogRef.afterClosed().subscribe(() => {
      this.toggleEditChanBol();
    });
  }

  // dialogRef.componentInstance.user = new User(this.user.toJSON());//Kopie
  //   dialogRef.componentInstance.userList = this.userList;//Kopie
  //   dialogRef.componentInstance.dialogReference = dialogRef;
  //   dialogRef.afterClosed().subscribe(result => {      
  //     this.madeChannel = result;
  //     if (result != "") { this.addChannel(); }

  //   });

  setEditChanPos() {
    if (this.menuHidden) {
      this.editChanPosLeft = '60px';
    } else {
      this.editChanPosLeft = '445px';
    }
  }

  toggleEditChanBol() {
    this.editChannelOpen = !this.editChannelOpen;
  }

  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.textThread += emoji;
    console.log(emoji);
    this.toggleEmojisDialog();
  }

  setTreadData(index: number, n: string, m: any) {
    this.threadList[this.number].communikation[this.commIndex].threads[index][n] = m;
  }
  getTreadData(index: number, n: string) {
    return this.threadList[this.number].communikation[this.commIndex].threads[index][n];
  }

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


  saveEmojiComment(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    let threadId = this.threadList[this.number].channel.idDB;
    // this.emojiText += emoji;//löschen 
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

    this.setTreadData(this.threadIndex, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.number].communikation });
    this.showEmojisTread = !this.showEmojisTread;
  }


  toggleEmojisDialog() {
    this.showEmojis = !this.showEmojis;
  }

  getTimeLastAnswer(thread: any) {
    let lastIndex = thread.answer.length - 1;
    if (lastIndex == -1) { return 0; }
    return thread.answer[lastIndex].time;
  }

  openThisThread(n: number, i: number, j: number) {
    console.log("number:" + n + " communikation:" + i + "  ThreadIndex:" + j);
    this.threadC.setValue(n, i, j);
    // this.openChat = true;
    this.newItemEventChannel.emit(this.threadC);

  }

  fromLoggedInUser(thread: any) {
    let uId = this.user.idDB;
    let aId = thread.iD;
    return (uId == aId);
  }

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

  sendQuestion(indexCannel: number) {
    let communikationLastIndex = this.threadList[indexCannel].communikation.length - 1;
    let lastdate = this.threadList[indexCannel].communikation[communikationLastIndex].date;
    let today = this.chathelper.parseDate(new Date(Date.now()));
    let threadId = this.threadList[indexCannel].channel.idDB;

    let thread = {
      "name": this.user.name,
      "iD": this.user.idDB, //of person that writes the message
      "edit": false,
      "smile": [],
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "message": this.textThread,
      "answer": [

      ]
    }

    if (today == lastdate) {
      this.threadList[indexCannel].communikation[communikationLastIndex].threads.push(thread);
      let th = this.threadList[indexCannel].communikation;
      console.log("upload data ", th);
      this.chathelper.updateDB(threadId, "thread", { "communikation": th });
    }
    else {
      if (this.threadList[indexCannel].communikation[communikationLastIndex].date == "") {
        this.threadList[indexCannel].communikation = [];
      }
      let c = {
        "date": today,
        "threads": [thread]
      }
      this.threadList[indexCannel].communikation.push(c);
      this.chathelper.updateDB(threadId, "thread", { "communikation": this.threadList[indexCannel].communikation });
    }
    this.textThread = "";
  }


  toggleEmojisThread(cIndex: number, tIndex: number) {
    this.showEmojisTread = !this.showEmojisTread;
    console.log("cIndex:" + cIndex + "   tIndex:" + tIndex);
    this.threadIndex = tIndex;
    this.commIndex = cIndex;
  }

  isThreadEmojiShown(cIndex: number, tIndex: number) {
    // console.log("tIndex", tIndex + " threadIndex "+this.threadIndex);
    return ((this.showEmojisTread) && (this.threadIndex == tIndex) && (this.commIndex == cIndex));
  }


  openAddPeopleDialog() {
    this.toggleAddPplChanBol();
    let dialogRef = this.dialog.open(AddPeopleDialogComponent);
    dialogRef.componentInstance.channel = this.threadList[this.number];//Kopie
    dialogRef.componentInstance.userList = this.userList;//Kopie
    // dialogRef.afterClosed().subscribe(() => {
    //     this.toggleEditChanBol();
    //   });
    this.setAddPplDialogPos(dialogRef);
    this.setAddPplDialogValues(dialogRef);
    this.subscribeAddPplDialog(dialogRef);
  }


  setAddPplDialogPos(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.addPanelClass('dialogBorToReNone');
    dialogRef.updatePosition({ right: '65px', top: '190px' });
  }


  setAddPplDialogValues(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    let instance = dialogRef.componentInstance;
    instance.user = new User(this.user.toJSON());
    instance.channel = this.threadList[this.number].channel;
    instance.userList = this.userList;
  }


  subscribeAddPplDialog(dialogRef: MatDialogRef<AddPeopleDialogComponent, any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.toggleAddPplChanBol();
    })
  }


  toggleAddPplChanBol() {
    this.addPeopleOpen = !this.addPeopleOpen;
  }

  getFlip(m: any) {
    return m.iD == this.user.idDB;
  }

  openEditWindow(m: any) {
    console.log("open edit window");
    this.openEditDialog = !this.openEditDialog;
    m.edit = true;
    // this.textEdit = m.message;
  }
  openEditPopUp() {
    this.openEditDialog = !this.openEditDialog;

  }
  openChannelMembersDialog() {
    this.toggleChannelMembersBol();
    let dialogRef = this.dialog.open(ChannelMembersComponent);
    this.setChannelMembersDialogPos(dialogRef);
    this.setChannelMembersValues(dialogRef);
    this.subscribeMembersChannelDialog(dialogRef);
    console.log('channelMembersOpen ist', this.channelMembersOpen)
  }

  setChannelMembersDialogPos(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    dialogRef.addPanelClass('dialogBorToReNone');
    dialogRef.updatePosition({ right: '165px', top: '190px' });
  }

  setChannelMembersValues(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    let instance = dialogRef.componentInstance;
    instance.user = new User(this.user.toJSON());
    instance.channel = this.threadList[this.number].channel;
    instance.userList = this.userList;
  }

  subscribeMembersChannelDialog(dialogRef: MatDialogRef<ChannelMembersComponent, any>) {
    dialogRef.afterClosed().subscribe(() => {
      this.toggleChannelMembersBol();
    })
  }

  toggleChannelMembersBol() {
    this.channelMembersOpen = !this.channelMembersOpen;
  }
}
