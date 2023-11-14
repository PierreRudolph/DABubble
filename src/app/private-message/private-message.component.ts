import { Component, inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { Emoji, EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { SmileHelper } from 'src/moduls/smileHelper.class';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent {
  // private userAuth: any; //authenticated user
  @Input() user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  private chatHepler: ChatHepler = new ChatHepler();
  @Input() userList: any;

  // private userUid: string = ""; //uid od the user
  // private unsub: any;
  // private unsubtalk: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  @Input() otherChatUser: User = new User();
  @Input() _setUser: boolean = false;
  private currentTalkId: string = "";
  @Input() talkList: any = [this.chatHepler.createEmptyTalk()];
  public currentTalkData: any = this.chatHepler.createEmptyTalk();
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

  // @Output() newItemEventUserList = new EventEmitter<any>();
  @Output() newItemEventLoggedUser = new EventEmitter<any>();
  @Output() newItemEventTalkList = new EventEmitter<any>();

  @ViewChild('textArea') textArea: { nativeElement: any; }

  constructor(public authService: AuthService, public router: Router) {

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
  saveEdit(m: any) {
    m.edit = false;
    m.message = this.textEdit;
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
      "message": text,
    }
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
    let mes = this.createMessageFromText(this.text);
    console.log(mes)
    if (!this.exist) {
      this.startTalk(mes);
      this.exist = true;
    }
    else {
      this.saveMessageExist(mes);
    }
    setTimeout(() => {
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
    let uT = this.user.talkID;  //user talkliste         
    let oT = this.otherChatUser.talkID;  //other talklist
    uT.push(talkUser);
    oT.push(talkOther);
    this.chatHepler.updateDB(this.user.idDB, "user", { "talkID": uT });
    this.chatHepler.updateDB(this.otherChatUser.idDB, "user", { "talkID": oT });
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
    // console.log("communikation Talk", this.currentTalkData);
    return t;
  }

  /**
   * Determines the talk-id with otherChatUser and opens it.
   */

  openTalk() {
    let talkId = "";
    console.log("openTalk");
    this.exist = false;
    this.talkOpen = true;
    let dbIDOther = this.otherChatUser.idDB;
    let talks = this.user.talkID; // list of all the talks of the user   
    // console.log("talks ", talks);
    // console.log("otherChatUser ", dbIDOther);
    // console.log("user ", this.user);

    talks.forEach(t => {
      let a: any;
      a = t;
      console.log(" dbIDOther ", dbIDOther + "  a.oUDbID:" + a.oUDbID);
      if (a.oUDbID === dbIDOther) {
        this.exist = true;
        talkId = a.talkID;
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
      console.log("talk exist");
      this.openExistingTalk(talkId);
      this.currentTalkId = talkId;
    } else {
      console.log("not exist");
      this.currentTalkData = this.chatHepler.createEmptyTalk()
      this.currentTalkData.communikation = [];//---------------------------
      console.log("current data ", this.currentTalkData);
    }
  }

  openExistingTalk(talkId: string) {
    this.getTalkById(talkId);
  }

  isItMe() {
    return this.otherChatUser.idDB == this.user.idDB;
  }

  setOtherUser(user: User) {
    this.otherChatUser = user;
    console.log("data", this.currentTalkData);
    this.openTalk();

  }

  // async updateDB(id: string, coll: string, info: {}) {

  //   let docRef = doc(this.firestore, coll, id);
  //   await updateDoc(docRef, info).catch(
  //     (err) => { console.log(err); });
  // }

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
      this.toggleEmojisDialog();
    }
    if (this.showEmojisEdit) {
      this.textEdit += emoji;
      this.toggleEmojisDialogEdit()
    }
  }

  /** Saves the given emoji as a comment pinned under the message.
   * 
   * @param e JSON Object that contains the information of the emoji that should be stored in the text.
   */
  saveEmojiComment(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    let talkId = this.currentTalkData.idDB; 
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
    console.log("sm", this.currentTalkData.communikation[this.communikationIndex].messages[i]);
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

  toggleEmojisDialog() {
    this.showEmojis = !this.showEmojis;
  }

  toggleEmojisDialogEdit() {
    this.showEmojisEdit = !this.showEmojisEdit;
  }

  toggleEmojisDialogComment(i: number, mIndex: number) {
    this.showEmojisComment = !this.showEmojisComment;
    this.communikationIndex = i;
    this.emojiMessageIndex = mIndex;
  }

  // addEmoji(selected: Emoji) {
  //   const emoji: string = (selected.emoji as any).native;
  //   const input = this.textArea.nativeElement;
  //   input.focus();
  //   console.log(emoji)
  //   //this.emojiPicker_open = false;
  //   //let unicodeCode: string = selected.emoji.unified;
  //   //let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
  //   // if (document.execCommand) { // document.execCommand is absolute but it //add support for undo redo and insert emoji at carrot position
  //   //   //any one has better solution ?

  //   //   var event = new Event('input');
  //   //   document.execCommand('insertText', false, emoji);
  //   //   return;
  //   // }
  //   // insert emoji on carrot position
  //   const [start, end] = [input.selectionStart, input.selectionEnd];
  //   input.setRangeText(emoji, start, end, 'end');
  // }

}
