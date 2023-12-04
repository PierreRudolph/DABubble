import { Component, inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc } from '@angular/fire/firestore';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { Emoji, EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { SmileHelper } from 'src/moduls/smileHelper.class';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent {
  // private userAuth: any; //authenticated user
  @Input() user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  // public fireStorage:AngularFireStorage = inject(AngularFireStorage);
  private chatHepler: ChatHepler = new ChatHepler();
  @Input() userList: any;
  public dataUpload = { "link": "", "title": "" };
  // private userUid: string = ""; //uid od the user
  // private unsub: any;
  // private unsubtalk: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  @Input() otherChatUser: User = new User();
  @Input() _setUser: boolean = false;
  public currentTalkId: string = "";
  @Input() talkList: any = [this.chatHepler.createEmptyTalk()];
  @Input() currentTalkData: any = this.chatHepler.createEmptyTalk();
  public text: string = "";
  public textEdit: string = "";
  public exist = false;
  public talkOpen: boolean = false;
  public openEditDialog: boolean = false;
  public openEdit: boolean = false;
  showEmojis: boolean | undefined;
  showEmojisEdit: boolean | undefined;
  showEmojisComment: boolean | undefined;
  emojiMessageIndex = 0;
  communikationIndex = 0;
  smileHelper: SmileHelper = new SmileHelper();
  chatHelper: ChatHepler = new ChatHepler();
  public messageInformation: any[] = [];
  public addresses = false;
  private mA: HTMLInputElement;
  private upload: any;


  // @Output() newItemEventUserList = new EventEmitter<any>();
  @Output() newItemEventLoggedUser = new EventEmitter<any>();
  @Output() newItemEventTalkList = new EventEmitter<any>();
  @Output() sendCurrentTalkId = new EventEmitter<string>();
  @Output() callOpenUser = new EventEmitter<User>();

  @ViewChild('textArea') textArea: { nativeElement: any; }

  constructor(public authService: AuthService, public router: Router, public dialog: MatDialog) {
    console.log(window.innerWidth)
    setTimeout(() => {
      this.mA = (document.getElementById("messageArea") as HTMLInputElement | null);
      this.upload = (document.getElementById("imgPrivate") as HTMLInputElement | null);
      // this.mA.scrollTo({ top: this.mA.scrollHeight, behavior: 'smooth' });
      let date = new Date(Date.now());
      let day = date.getDay();
      console.log("day",day);
    }, 1500);
  }

  /**
   * Opens the edid Window
   * 
   * @param m Contains all the data of the current message.
   */
  openEditWindow(m: any) {
    this.openEditDialog = !this.openEditDialog;
    m.edit = true;
    this.textEdit = m.message;
  }

  closeEdit(m: any) {
    m.edit = false;
  }

  /**
   * Computed, when we klick on the vert icon, that appears when hover over the message.
   */
  openEditPopUp() {
    this.openEditDialog = !this.openEditDialog;
  }

  /**
   * Saves the edited message
   * 
   * @param m Contains all the data of the current message.
   */
  saveEdit(m: any, i: number, mIndex) {
    m.edit = false;
    if (this.textEdit == "" && m.url.link == "") {
      this.deleteMessage(i, mIndex);
      return;
    }
    m.message = this.textEdit;
    m.messageSplits = this.chatHelper.getLinkedUsers(this.user, this.userList, this.textEdit);
    this.chatHepler.updateDB(this.currentTalkId, "talk", this.currentTalkData);
  }

  talkRef() {
    return collection(this.firestore, 'talk');
  }

  setOpen(value: boolean) {
    this.openChat = value;
  }

  /**
   * Creates a JSON that repesents the message. It contains the given text and other needed Informations.
   * 
   * @param text String that yould be in the new created message.
   * @returns 
   */
  createMessageFromText(text: string) {
    let mes = {
      "name": this.user.name,
      "iD": this.user.idDB,
      "edit": false,
      "smile": [],
      "time": this.chatHepler.parseTime(new Date(Date.now())),
      "url": { "link": this.dataUpload.link, "title": this.dataUpload.title },
      "message": text,
      "messageSplits": this.chatHelper.getLinkedUsers(this.user, this.userList, text),
    }
    this.messageInformation = this.chatHelper.getLinkedUsers(this.user, this.userList, text);
    this.dataUpload.link = "";
    this.dataUpload.title = "";
    return mes;
  }

  /**
   * Saves the given JSON in a appropriate way in currentTalkData.
   * It consoders wheater the messages was createt on anothr day than the last one.
   * 
   * @param mes JSON that represents the message.
   */
  saveMessageExist(mes: {}) {
    setTimeout(() => {
      let len = this.currentTalkData.communikation.length;
      let date = this.currentTalkData.communikation[len - 1].date;
      let today = this.chatHepler.parseDate(new Date(Date.now()));
      if (date == today) {
        this.currentTalkData.communikation[len - 1].messages.push(mes);
      } else {
        if (date == "") { this.currentTalkData.communikation = []; }
        let com = {
          "date": this.chatHepler.parseDate(new Date(Date.now())),
          "messages": [mes]
        }
        this.currentTalkData.communikation.push(com);
      }
    }, 500);
  }

  /**
   * Saves the message stored in currentTalkData to the database. If it is the first message, that is starts a new talk.
   */
  saveMessage() {
    if (this.text == "" && this.dataUpload.link == "") { return; }
    let mes = this.createMessageFromText(this.text);
    if (!this.exist) {
      this.startTalk(mes);
      this.exist = true;
    }
    else {
      this.saveMessageExist(mes);
    }
    setTimeout(() => {
      this.currentTalkData.idDB = this.currentTalkId;
      this.chatHepler.updateDB(this.currentTalkId, "talk", this.currentTalkData);
    }, 750);
    this.text = "";
  }
  /**
   * 
   * @param id id of the user
   * @returns The imagePath of the given user
   */
  getIconFromName(id: string) {
    if (id == this.user.idDB) {
      return this.user.iconPath;
    } else return this.otherChatUser.iconPath;
  }

  /**
   * Initializes a new private talk. Sets the needed information to both users, that take part on the conversation.
   */
  startTalkInitialize() {

    let talkUser = { //the id of the talk is saved in a List of the user
      "talkID": this.currentTalkId,
      "oUDbID": this.otherChatUser.idDB
    }// other user database id
    let talkOther = {//the id of the talk is saved in a List of the other user
      "talkID": this.currentTalkId,
      "oUDbID": this.user.idDB
    }// other user database id 
    this.user.talkID.push(talkUser);  //user talkliste         
    this.otherChatUser.talkID.push(talkOther);  //other talklist       
    this.sendCurrentTalkId.emit(this.currentTalkId);

    this.chatHepler.updateDB(this.user.idDB, "user", this.user.toJSON());
    this.chatHepler.updateDB(this.otherChatUser.idDB, "user", this.otherChatUser.toJSON());
  }

  /** Called when a new private talk is started.
   * 
   * @param talk JSON of information of the new message
   * @returns 
   */
  startTalk(talk: {}): {} {
    let t: any = this.chatHepler.createNewTalk(this.user, this.otherChatUser);

    t.communikation[0].messages = [talk];
    this.addTalk(t);
    setTimeout(() => {
      this.startTalkInitialize();
    }, 2000);
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
    let talks = this.user.talkID; // list of all the talks of the user       
    talks.forEach(t => {
      let a: any;
      a = t;
      if (a.oUDbID === dbIDOther) {
        this.exist = true;
        talkId = a.talkID;
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
      this.currentTalkData = this.chatHepler.createEmptyTalk();
      this.currentTalkData.communikation = [];//---------------------------

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
    //  setTimeout(()=>{ this.mA.scrollTop = this.mA.scrollHeight;},1500);
    setTimeout(() => {
      if (this.mA) { this.mA.scrollTo({ top: this.mA.scrollHeight, behavior: 'smooth' }); }

    }, 1500);
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
            this.chatHepler.updateDB(this.currentTalkId, 'talk', { "idDB": this.currentTalkId });
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
      this.text += emoji;
      this.showEmojis = !this.showEmojis;
    }
    if (this.showEmojisEdit) {
      this.textEdit += emoji;
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
    // let talkId = this.currentTalkData.idDB;
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
    this.text += '@' + u.name;
    this.addresses = !this.addresses;

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
    this.dataUpload.link = "";
    this.dataUpload.title = "";
  }

  deleteMessage(i: number, mIndex: number) {
    if (this.currentTalkData.communikation[i].messages.length > 1) {
      this.currentTalkData.communikation[i].messages.splice(mIndex, 1);
    }
    else {
      if (this.currentTalkData.communikation.length > 1) {
        this.currentTalkData.communikation.splice(i, 1);
      }
      else { this.currentTalkData.communikation = [{ "date": "", "messages": [] }]; }
    }
    this.chatHelper.updateDB(this.currentTalkId, "talk", { "communikation": this.currentTalkData.communikation });
  }

  deleteUp(e: any, i: number, mIndex: number) {
    e.preventDefault();
    if (this.currentTalkData.communikation[i].messages[mIndex].message != "") {
      this.currentTalkData.communikation[i].messages[mIndex].url = { "link": "", "title": "" };
    } else {
      this.deleteMessage(i, mIndex);
    }

    this.chatHelper.updateDB(this.currentTalkId, "talk", { "communikation": this.currentTalkData.communikation });
  }

  noEmoji() {
    if (this.showEmojis)
      this.showEmojis = false;
    if (this.showEmojisComment)
      this.showEmojisComment = false;
    if (this.showEmojisEdit)
      this.showEmojisEdit = false;
  }
}



