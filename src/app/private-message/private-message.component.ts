import { Component, inject, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc } from '@angular/fire/firestore';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { SmileHelper } from 'src/moduls/smileHelper.class';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent {
  public firestore: Firestore = inject(Firestore);
  public chatHelper: ChatHepler = new ChatHepler();
  public smileHelper: SmileHelper = new SmileHelper();
  @Input() userList: Array<User>;
  @Input() user: User = new User();
  @Input() indexLastUser: number = -2;
  @Input() otherChatUser: User = new User();
  @Input() _setUser: boolean = false;
  @Input() talkList: any = [this.chatHelper.createEmptyTalk()];
  @Input() currentTalkData: any = this.chatHelper.createEmptyTalk();

  public dataUpload: { "link": string, "title": string } = { "link": "", "title": "" };

  public currentTalkId: string = "";
  public messageText: string = "";
  public messageTextEdit: string = "";

  private emojiMessageIndex: number = 0;
  private communikationIndex: number = 0;
  public exist: boolean = false;
  public openChat: boolean = false;
  public addressBoxOpen: boolean = false;
  public talkOpen: boolean = false;
  public openEditDialog: boolean = false;
  public openEdit: boolean = false;
  public showEmojis: boolean = false;
  public showEmojisEdit: boolean = false;
  public showEmojisComment: boolean = false;
  private clickInsideEmoji: boolean = false;
  private clickedInsideAddressBox: boolean = false;

  @Output() newItemEventLoggedUser = new EventEmitter<any>();
  @Output() newItemEventTalkList = new EventEmitter<any>();
  @Output() sendCurrentTalkId = new EventEmitter<string>();
  @Output() callOpenUser = new EventEmitter<User>();
  @Output() lastUserIndex = new EventEmitter<number>();

  @ViewChild('messageArea') messageArea: ElementRef;
  @ViewChild('imgPrivate') upload: HTMLInputElement;

  constructor(public authService: AuthService, public router: Router, public dialog: MatDialog) {
    this.onLoadSetOpen();
  }


  /**
   * open talk on load is necessary if window-size gets so small that private-message would close,
   * and after window-size gets big enough to show private-message again this code manage to open Talk properly 
   */
  onLoadSetOpen() {
    this.talkOpen = true;
    setTimeout(() => {
      this.openTalk();
    }, 10);
  }


  /**
   * Opens the edit Window
   * 
   * @param m Contains all the data of the current message.
   */
  openEditWindow(m: any) {
    this.openEditDialog = !this.openEditDialog;
    m.edit = true;
    this.messageTextEdit = m.message;
  }


  closeEdit(m: any) {
    m.edit = false;
  }


  /**
   * Computed, when we klick on the vert icon, that appears when hover over the message.
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
   * Saves the edited message
   * @param m Contains all the data of the current message.
   */
  async saveEdit(m: any, i: number, mIndex) {
    m.edit = false;
    if (this.messageTextEdit == "" && m.url.link == "") {
      this.deleteMessage(i, mIndex);
      return;
    }
    m.message = this.messageTextEdit;
    m.messageSplits = this.chatHelper.getLinkedUsers(this.user, this.userList, this.messageTextEdit);
    await this.chatHelper.updateDB(this.currentTalkId, "talk", this.currentTalkData);
  }


  talkRef() {
    return collection(this.firestore, 'talk');
  }


  setOpen(value: boolean) {
    this.openChat = value;
  }


  /**
   * Creates a JSON that repesents the message. It contains the given text and other needed Informations.
   * @param text String that yould be in the new created message.
   * @returns 
   */
  createMessageFromText(text: string) {
    let mes = this.createMessageJSON(text);
    this.dataUpload.link = "";
    this.dataUpload.title = "";
    return mes;
  }


  createMessageJSON(text: string) {
    return {
      "name": this.user.name,
      "iD": this.user.idDB,
      "edit": false,
      "smile": [],
      "time": this.chatHelper.parseTime(new Date(Date.now())),
      "url": { "link": this.dataUpload.link, "title": this.dataUpload.title },
      "message": text,
      "messageSplits": this.chatHelper.getLinkedUsers(this.user, this.userList, text),
    }
  }


  /**
   * Saves the given JSON in a appropriate way in currentTalkData.
   * It consoders wheater the messages was createt on anothr day than the last one.
   * 
   * @param mes JSON that represents the message.
   */
  saveMessageExist(mes: {}) {
    let len = this.currentTalkData.communikation.length;
    let date = this.currentTalkData.communikation[len - 1].date;
    let today = this.chatHelper.parseDate(new Date(Date.now()));
    if (date == today) {
      this.currentTalkData.communikation[len - 1].messages.push(mes);
    } else {
      this.ifFirstComClearComArray(date);
      let com = this.createNewComJSON(mes);
      this.currentTalkData.communikation.push(com);
    }
  }


  /**
   * when actual message is first communikation, this function clears the communikation array, to get rid of the empty com JSON
   * @param {string} date 
   */
  ifFirstComClearComArray(date: string) {
    if (date == "") { this.currentTalkData.communikation = []; }
  }


  createNewComJSON(mes: {}) {
    return {
      "date": this.chatHelper.parseDate(new Date(Date.now())),
      "messages": [mes]
    }
  }


  /**
   * Saves the message stored in currentTalkData to the database. If it is the first message, that is starts a new talk.
   */
  async saveMessage() {
    if (this.messageIsEmpty()) { return; }
    let mes = this.createMessageFromText(this.messageText);
    if (!this.exist) {
      await this.startTalk(mes);
      this.currentTalkData.idDB = this.currentTalkId;
      this.exist = true;
    }
    else {
      this.saveMessageExist(mes);
      this.currentTalkData.idDB = this.currentTalkId;
      await this.chatHelper.updateDB(this.currentTalkId, "talk", this.currentTalkData);
    }
    this.messageText = "";
  }


  messageIsEmpty() {
    return (this.messageText == "" && this.dataUpload.link == "");
  }


  /**
   * 
   * @param id id of the user
   * @returns The imagePath of the given user
   */
  getIconFromName(id: string) {
    if (id == this.user.idDB) {
      return this.user.iconPath;
    } else {
      return this.otherChatUser.iconPath
    };
  }


  /**
   * Initializes a new private talk. Sets the needed information to both users, that take part on the conversation.
   */
  async startTalkInitialize() {
    let talkUser = this.createTalkJSON(this.currentTalkId, this.otherChatUser.idDB);
    let talkOther = this.createTalkJSON(this.currentTalkId, this.user.idDB);
    this.user.talkID.push(talkUser);
    if (!this.chatWithMyself()) {
      this.otherChatUser.talkID.push(talkOther);
    }
    this.sendCurrentTalkId.emit(this.currentTalkId);
    await this.chatHelper.updateDB(this.user.idDB, "user", this.user.toJSON());
    await this.chatHelper.updateDB(this.otherChatUser.idDB, "user", this.otherChatUser.toJSON());
    await this.chatHelper.updateDB(this.currentTalkId, "talk", this.currentTalkData);
  }


  /**
   * creates a JSON with the given talk id and the USers Database Id
   * @param {string} talkID 
   * @param {string} userIdDB 
   * @returns created JSON
   */
  createTalkJSON(talkID: string, userIdDB: string) {
    return {
      "talkID": talkID,
      "oUDbID": userIdDB
    }
  }


  chatWithMyself() {
    return this.user.idDB == this.otherChatUser.idDB;
  }


  /** Called when a new private talk is started.
   * @param talk JSON of information of the new message
   * @returns 
   */
  async startTalk(talk: {}): Promise<{}> {
    let t: any = this.chatHelper.createNewTalk(this.user, this.otherChatUser);
    t.communikation[0].messages = [talk];
    await this.addTalk(t);
    await this.startTalkInitialize();
    t.idDB = this.currentTalkId;
    this.currentTalkData = t;
    this.sendCurrentTalkId.emit(this.currentTalkId);
    return t;
  }


  keyDownFunction(input: any) {
    if (input.key == "Enter" && !input.shiftKey) {
      input.preventDefault();
      this.saveMessage();
    }
  }


  /**
   * Determines the talk-id with otherChatUser and opens it.
   */
  openTalk() {
    let talkId = "";
    this.exist = false;
    this.talkOpen = true;
    let dbIDOther = this.otherChatUser.idDB;
    let talks = this.user.talkID;
    talks.forEach(talk => {
      if (talk.oUDbID === dbIDOther) {
        this.exist = true;
        talkId = talk.talkID;
        this.currentTalkId = talkId;
        this.sendCurrentTalkId.emit(talkId);
      }
    });

    this.openeningTalk(talkId);
  }


  /** 
   * Used by openTalk(). Opens the talk in the appropirate way depending if it is a new talk or an existing one.
   * 
   * @param talkId Id of the talk, that should be opend
   */
  openeningTalk(talkId: string) {
    if (this.exist) {
      this.openExistingTalk(talkId);
      this.currentTalkId = talkId;
    } else {
      this.currentTalkId = "";
      this.sendCurrentTalkId.emit("");
      this.currentTalkData = this.chatHelper.createEmptyTalk();
      this.currentTalkData.communikation = [];
    }
  }


  openExistingTalk(talkId: string) {
    this.getTalkById(talkId);
  }


  isItMe() {
    return this.otherChatUser.idDB == this.user.idDB;
  }


  setOtherUser(user: User) {
    this.currentTalkId = "";
    this.otherChatUser = user;
    this.openTalk();

    setTimeout(() => {
      if (this.messageArea) { this.messageArea.nativeElement.scrollTo({ top: this.messageArea.nativeElement.scrollHeight, behavior: 'smooth' }) }
    }, 10);
  }


  /**
   * Stores a new talk in firebase.
   * 
   * @param item Data of the new talk that shell be stored in the firestore database
   */
  async addTalk(item: {}) {
    await addDoc(this.talkRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            this.currentTalkId = docRef.id;
            this.chatHelper.updateDB(this.currentTalkId, 'talk', { "idDB": this.currentTalkId });
          }
        });
  }


  /**
   * Loads the data of the talkfrom firestore and stores them in currentTalkData
   * 
   * @param id id of the talk
   */
  async getTalkById(id: string) {
    const docRef = doc(this.firestore, "talk", id);
    let docSnap = await getDoc(docRef);

    if (docSnap != null) {
      this.currentTalkData = docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
    }
  }


  getFlip(m: any) {
    return m.iD == this.user.idDB
  }


  /** Puts the given emoji in the textare or in the texteditarea
   * 
   * @param e JSON Object that contains the information of the emoji that should be stored in the text.
   */
  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    if (this.showEmojis) {
      this.messageText += emoji;
      this.showEmojis = !this.showEmojis;
    }
    if (this.showEmojisEdit) {
      this.messageTextEdit += emoji;
      this.showEmojisEdit = !this.showEmojisEdit;
    }
  }


  /** Saves the given emoji as a comment pinned under the message.
   * 
   * @param e JSON Object that contains the information of the emoji that should be stored in the text.
   */
  saveEmojiComment(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    let talkId = this.currentTalkId;
    let sm = this.currentTalkData.communikation[this.communikationIndex].messages[this.emojiMessageIndex].smile;
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
    this.currentTalkData.communikation[this.communikationIndex].messages[this.emojiMessageIndex].smile = sm;
    this.chatHelper.updateDB(talkId, 'talk', { "communikation": this.currentTalkData.communikation });
    this.chatHelper.updateDB(talkId, 'talk', { "idDB": talkId });
    this.showEmojisComment = false;
  }


  /**
   * Removed the smilie of the smiliebox with the given location data.
   * 
   * @param i        index of the message where the smilie that sould be removed
   * @param sIndex   the index of the smilie in the smiliebox that sould be removed
   */
  removeSmile(i: number, sIndex: number) {
    let talkId = this.currentTalkData.idDB;
    let sm = this.currentTalkData.communikation[this.communikationIndex].messages[i].smile;
    let newUserList = this.smileHelper.removeUser(sm[sIndex].users, this.user)
    sm[sIndex].users = newUserList;
    if (sm[sIndex].users.length == 0) {
      sm.splice(sIndex, 1);
    }
    this.currentTalkData.communikation[this.communikationIndex].messages[i].smile = sm
    this.chatHelper.updateDB(talkId, 'talk', { "communikation": this.currentTalkData.communikation });
  }


  isEmojisCommentShown(i: number, index: number) {
    return this.showEmojisComment && (index == this.emojiMessageIndex) && (i == this.communikationIndex);
  }


  toggleEmojisDialog(event: any) {
    event.stopPropagation();
    this.showEmojis = !this.showEmojis;
  }


  toggleEmojisDialogEdit(event: any) {
    event.stopPropagation();
    this.showEmojisEdit = !this.showEmojisEdit;
  }


  toggleEmojisDialogComment(event: any, i: number, mIndex: number) {
    event.stopPropagation();
    this.showEmojisComment = !this.showEmojisComment;
    this.communikationIndex = i;
    this.emojiMessageIndex = mIndex;
  }


  toggleAddressBoxOpen(event) {
    event.stopPropagation();
    this.addressBoxOpen = !this.addressBoxOpen;
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
    this.messageText += '@' + u.name;
    this.addressBoxOpen = !this.addressBoxOpen;

  }


  openDialog(user: User): void {
    const dialogRef = this.dialog.open(UserProfileComponent);
    dialogRef.componentInstance.user = new User(user.toJSON());
    dialogRef.componentInstance.ref = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      if (user) {
        this.callOpenUser.emit(user);

      }
    });
  }


  /**
 * Saves the uploaded portrait.
 * @param event Uploaded file
 */
  async onSelect(event: any) {
    await this.chatHelper.onSelect(event, this.dataUpload);
    this.upload.value = "";
  }


  showBlendin() {
    return this.dataUpload.link != "";
  }

  showLink(link: string) {
    return link != "";
  }


  closeUpload() {
    this.deleteFileFromStorage(this.dataUpload.title);
    this.dataUpload.link = "";
    this.dataUpload.title = "";
  }


  deleteMessage(i: number, mIndex: number) {
    if (this.currentTalkData.communikation[i].messages.length > 1) {
      this.deleteFileIfExist(i, mIndex);
      this.currentTalkData.communikation[i].messages.splice(mIndex, 1);
    }
    else {
      if (this.currentTalkData.communikation.length > 1) {
        this.deleteFileIfExist(i, mIndex);
        this.currentTalkData.communikation.splice(i, 1);
      }
      else {
        this.deleteFileIfExist(i, mIndex);
        this.currentTalkData.communikation = [{ "date": "", "messages": [] }];
      }
    }
    this.chatHelper.updateDB(this.currentTalkId, "talk", { "communikation": this.currentTalkData.communikation });
  }


  deleteUp(e: any, i: number, mIndex: number) {
    e.preventDefault();
    let fileTitle = this.getFileTitleIfExist(i, mIndex);
    if (this.currentTalkData.communikation[i].messages[mIndex].message != "") {
      this.deleteFileFromStorage(fileTitle);
      this.currentTalkData.communikation[i].messages[mIndex].url = { "link": "", "title": "" };
    } else {
      this.currentTalkData.communikation[i].messages[mIndex].url = { "link": "", "title": "" };

      this.deleteFileFromStorage(fileTitle);
      this.deleteMessage(i, mIndex);
    }
    this.chatHelper.updateDB(this.currentTalkId, "talk", { "communikation": this.currentTalkData.communikation });
  }


  deleteFileIfExist(i, mIndex) {
    let fileTitle = this.getFileTitleIfExist(i, mIndex);
    if (fileTitle) {
      this.deleteFileFromStorage(fileTitle);
    }
  }


  deleteFileFromStorage(fileTitle) {
    this.chatHelper.deleteFileFromStorage(fileTitle);
  }


  getFileTitleIfExist(i, mIndex) {
    if (this.currentTalkData.communikation[i].messages[mIndex].url.title) {
      return this.currentTalkData.communikation[i].messages[mIndex].url.title
    } else { return false }
  }


  closeDialogs() {
    if (this.clickInsideEmoji) {
      this.clickInsideEmoji = false;
      return;
    }

    if (this.clickedInsideAddressBox) {
      this.clickedInsideAddressBox = false;
      return;
    }

    if (this.showEmojis)
      this.showEmojis = false;
    if (this.showEmojisComment)
      this.showEmojisComment = false;
    if (this.showEmojisEdit)
      this.showEmojisEdit = false;
    if (this.addressBoxOpen)
      this.addressBoxOpen = false;
  }


  clickedInsideEmojiMart() {
    this.clickInsideEmoji = true;
  }

  clickedInsideAdressBox() {
    this.clickedInsideAddressBox = true;
  }
}