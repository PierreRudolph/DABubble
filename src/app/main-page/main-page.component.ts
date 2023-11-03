import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

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
  public otherChatUser: User = new User();
  private currentTalkId: string = "";
  public currentTalkData: any = this.createEmptyTalk();
  public text: string = "";
  private communicationIndex = 0;
  public exist = false;
  public talkOpen: boolean = false;

  constructor(public authService: AuthService, public router: Router) {
    setTimeout(() => {
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "";
      this.unsub = this.subUserInfo();
      this.unsubtalk = this.subTalkInfo();
    }, 2000);
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

  createEmptyTalk(): {} {
    let t = {
      "member1": "",
      "member1DBid": "",
      "member2": "",
      "member2DBid": "",
      "idDB": "",
      "communikation": [{
        "date": "",
        "messages": [{
          "name": "",
          "time": "",
          "message": "",
        }]
      }]
    }
    return t;
  }

  createNewTalk(): {} {
    let t = {
      "member1": this.user.name,
      "member1DBid": this.user.idDB,
      "member2": this.otherChatUser.name,
      "member2DBid": this.otherChatUser.idDB,
      "idDB": "",
      "communikation": [{
        "date": this.parseDate(new Date(Date.now())),
        "messages": [{
          "name": "",
          "iD": "",
          "time": "",
          "message": "",
        }]
      }]
    }
    return t;
  }

  saveMessage() {
    let mes = {
      "name": this.user.name,
      "iD": this.user.name,
      "time": this.parseTime(new Date(Date.now())),
      "message": this.text,
    }

    console.log("open new talk", this.exist);
    if (!this.exist) {
      this.startTalk(mes);
      this.exist = true;
    }
    else {
      setTimeout(() => {
        let len = this.currentTalkData.communikation.length;
        let date = this.currentTalkData.communikation[len - 1].date;

        if (date == this.parseDate(new Date(Date.now()))) {
          this.currentTalkData.communikation[this.communicationIndex].messages.push(mes);
        } else {
          let com = {
            "date": this.parseDate(new Date(Date.now())),
            "messages": [mes]
          }
          this.currentTalkData.communikation.push(com);
        }

      }, 500);
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

  startTalk(talk: {}): {} {
    let t: any = this.createNewTalk();
    t.communikation[0].messages = [talk];
    this.addTalk(t);
    
    setTimeout(() => {

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
      this.updateDB(this.currentTalkId, 'talk', { "idDB": this.currentTalkId });
      this.updateDB(this.user.idDB, "user", { "talkID": uT });
      this.updateDB(this.otherChatUser.idDB, "user", { "talkID": oT });
    }, 1000);
    this.currentTalkData = t;
    console.log("current talk",this.currentTalkData);
    return t;
  }

  parseTime(dt: Date) {
    let min = dt.getMinutes();
    let hour = dt.getHours();
    return hour + ":" + min;
  }

  parseDate(dt: Date) {
    let day = dt.getDate();
    let month = dt.getMonth() + 1;
    let year = dt.getFullYear();

    return day + "." + month + "." + year;
  }

  openTalk() {
    this.exist = false;
    this.talkOpen = true;
    let dbIDOther = this.otherChatUser.idDB;
    let talks = this.user.talkID; // list of all the talks of the user   

    let talkId = "";
    talks.forEach(t => {
      let a: any;
      a = t;
      console.log("a.oUDBID", a.oUDbID);
      if (a.oUDbID === dbIDOther) {
        this.exist = true;
        talkId = a.talkID;
      }
    });

    if (this.exist) {
      this.openExistingTalk(talkId);
      this.currentTalkId = talkId;
    }else{
      this.currentTalkData = this.createEmptyTalk();
    }
  }

  openExistingTalk(talkId: string) {
    console.log("existing talk is", talkId);
    this.getTalkById(talkId);

  }

  setUser(user: User) {
    this.otherChatUser = user;
    this.openTalk();
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
      console.log("No such document!");
    }
  }
}
