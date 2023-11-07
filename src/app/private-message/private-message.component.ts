import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ChatHepler } from 'src/moduls/chatHelper.class';


@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss']
})
export class PrivateMessageComponent {
  private userAuth: any; //authenticated user
  public user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  private userUid: string = ""; //uid od the user
  private unsub: any;
  private unsubtalk: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  @Input() otherChatUser: User = new User();
  @Input() _setUser: boolean = false;
  private currentTalkId: string = "";
  private chatHepler: ChatHepler = new ChatHepler();
  public currentTalkData: any = this.chatHepler.createEmptyTalk();
  public text: string = "";
  public textEdit: string = "";
  public exist = false;
  public talkOpen: boolean = false;
  public openEditDialog: boolean = false;
  public openEdit: boolean = false;
  @Output() newItemEventUserList = new EventEmitter<any>();
  @Output() newItemEventLoggedUser = new EventEmitter<any>();


  constructor(public authService: AuthService, public router: Router) {
    setTimeout(() => {
      console.log("call construktor");
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "";
      this.unsub = this.subUserInfo();
      this.unsubtalk = this.subTalkInfo();
    
    }, 1000);
  }



  addNewItem(userList: any) {
    this.newItemEventUserList.emit(userList);
    this.newItemEventLoggedUser.emit(this.user);
  }
  openEditWindow(m: any) {
    this.openEditDialog = !this.openEditDialog;
    m.edit = true;
    this.textEdit = m.message;
  }

  closeEdit(m: any) {
    m.edit = false;
  }

  openEditPopUp() {
    this.openEditDialog = !this.openEditDialog;
  }

  saveEdit(m: any) {
    m.edit = false;
    m.message = this.textEdit;
    this.updateDB(this.currentTalkId, "talk", this.currentTalkData);
  }

  userRef() {
    return collection(this.firestore, 'user');
  }

  talkRef() {
    return collection(this.firestore, 'talk');
  }

  setOpen(value: boolean) {
    this.openChat = value;
  }





  createMessageFromText(text: string) {
    let mes = {
      "name": this.user.name,
      "iD": this.user.idDB,
      "edit": false,
      "time": this.chatHepler.parseTime(new Date(Date.now())),
      "message": text,
    }
    return mes;
  }

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

  saveMessage() {
    let mes = this.createMessageFromText(this.text);

    if (!this.exist) {
      this.startTalk(mes);
      this.exist = true;
    }
    else {
      this.saveMessageExist(mes);
    }

    setTimeout(() => {
      this.updateDB(this.currentTalkId, "talk", this.currentTalkData);
    }, 750);
    this.text = "";
  }


  getIconFromName(name: string) {
    if (name == this.user.name) {
      return this.user.iconPath;
    } else return this.otherChatUser.iconPath;
  }

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
    this.updateDB(this.user.idDB, "user", { "talkID": uT });
    this.updateDB(this.otherChatUser.idDB, "user", { "talkID": oT });
  }

  startTalk(talk: {}): {} {

    let t: any = this.chatHepler.createNewTalk(this.user, this.otherChatUser);

    t.communikation[0].messages = [talk];
    this.addTalk(t);
    setTimeout(() => {
      this.startTalkInitialize();
    }, 2000);
    t.idDB = this.currentTalkId;
    this.currentTalkData = t;
    return t;
  }

  // parseTime(dt: Date) {
  //   let min = dt.getMinutes();
  //   let hour = dt.getHours();
  //   return hour + ":" + min;
  // }

  // parseDate(dt: Date) {
  //   let day = dt.getDate();
  //   let month = dt.getMonth() + 1;
  //   let year = dt.getFullYear();

  //   return day + "." + month + "." + year;
  // }

  openTalk() {
    this.exist = false;
    this.talkOpen = true;
    let dbIDOther = this.otherChatUser.idDB;
    let talks = this.user.talkID; // list of all the talks of the user   

    let talkId = "";
    talks.forEach(t => {
      let a: any;
      a = t;
      if (a.oUDbID === dbIDOther) {
        this.exist = true;
        talkId = a.talkID;
      }
    });

    if (this.exist) {
      this.openExistingTalk(talkId);
      this.currentTalkId = talkId;
    } else {
      this.currentTalkData = this.chatHepler.createEmptyTalk();
    }
  }

  openExistingTalk(talkId: string) {
    this.getTalkById(talkId);
  }

  setOtherUser(user: User) {
    this.otherChatUser = user;
    this.openTalk();
    setTimeout(() => { this.openTalk() },1500);
  }

  async updateDB(id: string, coll: string, info: {}) {

    let docRef = doc(this.firestore, coll, id);
    await updateDoc(docRef, info).catch(
      (err) => { console.log(err); });
  }

  async addTalk(item: {}) {

    await addDoc(this.talkRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            this.currentTalkId = docRef.id;
            this.updateDB(this.currentTalkId, 'talk', { "idDB": this.currentTalkId });
          }
        });
  }

  subUserInfo() {
    let ref = this.userRef();
    return onSnapshot(ref, (list) => {
      this.userList = [];
      list.forEach(elem => {
        let u = new User(elem.data())
        if (u.uid == this.userUid) {
          this.user = u;
          this.user.status = "aktiv";
        }
        else { this.userList.push(u); }
      });
      this.addNewItem(this.userList);
    });
  }

  subTalkInfo() {
    let ref = this.talkRef();
    return onSnapshot(ref, (list) => {
      list.forEach(elem => {
        if (elem.id == this.currentTalkId) {
          this.currentTalkData = elem.data();
        }
      });
    });
  }

  async getTalkById(id: string) {
    const docRef = doc(this.firestore, "talk", id);
    let docSnap = await getDoc(docRef);

    if (docSnap != null) {
      // console.log("Document data:",docSnap.data());
      this.currentTalkData = docSnap.data();

    } else {
      // docSnap.data() will be undefined in this case

    }
  }

  getFlip(m: any) {
    return m.iD == this.user.idDB
  }


}
