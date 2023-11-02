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
  public currentTalkData:any = this.createEmptyTalk();

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
        "date":"",
        "messages": [{
          "name": "",
          "time": "",
          "message": " Hallo das hier ist die gespeicherte Nachricht",
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
        "date": new Date().toString(),
        "messages": [{
          "name": this.user.name,
          "time": Date.now(),
          "message": " Hallo das hier ist die gespeicherte Nachricht",
        }]
      }]
    }
    return t;
  }

  startTalk(): {} {
    let t = this.createNewTalk();
    this.addTalk(t);

    setTimeout(() => {
      console.log("timeout");

      let talkUser = {
        "cTalkID": this.currentTalkId,
        "oUDbID": this.otherChatUser.idDB
      }// other user database id
      let talkOther = {
        "cTalkID": this.currentTalkId,
        "oUDbID": this.user.idDB
      }// other user database id
      let uT= this.user.talkID;  //user talk    
      uT.push(talkUser);
      let oT= this.otherChatUser.talkID;  //other Talk  
      oT.push(talkOther);
      this.updateDB(this.currentTalkId, 'talk', { "idDB": this.currentTalkId });
      this.updateDB(this.user.idDB, "user", { "talkID": uT });
      this.updateDB(this.otherChatUser.idDB, "user", { "talkID": oT });
    }, 1000);
    console.log(t);
    return t;
  }

  openTalk() {
    let dbIDOther = this.otherChatUser.idDB;
    let talks = this.user.talkID;
    console.log("idOther", dbIDOther);

    let exist = false;
    let talkId = "";
    talks.forEach(t => {
      let a: any;
      a = t;
      console.log("a.oUDBI", a.oUDbID);
      if (a.oUDbID === dbIDOther) {
        exist = true;
        talkId = a.cTalkID;
      }
    });
    if (exist) {
      this.openExistingTalk(talkId);
     
    } else {
      console.log("open new talk", exist);
      this.startTalk();
    }
  }

  

  openExistingTalk(talkId: string) {
    console.log("existing talk is", talkId);   
    this.getTalkById(talkId);
    let a:any;
    
    console.log("curren talk data",this.currentTalkData.communikation[0].date);
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
      console.log('logged in User', this.user);
      console.log('UserList', this.userList);
      // console.log('gameData anzeigen', this.userList);
    });
  }

  subTalkInfo() {
    let ref = this.talkRef();
    return onSnapshot(ref, (list) => {    
      list.forEach(elem => {
        if(elem.id == this.currentTalkId){
          this.currentTalkData = elem.data();         
        }
      });
      console.log("current talk",this.currentTalkData);
    });
  }

 async getTalkById(id:string){
    const docRef = doc(this.firestore, "talk", id);
    let docSnap = await getDoc(docRef);

    if (docSnap!=null) {
      // console.log("Document data:",docSnap.data());
      this.currentTalkData = docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  


}
