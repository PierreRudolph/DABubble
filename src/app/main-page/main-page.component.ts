import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  public idDoc = "";
  private userAuth: any; //authenticated user
  public user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  private userUid: string = ""; //uid od the user
  private unsub: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  public otherChatUser: User = new User();

  constructor(public authService: AuthService, public router: Router) {
    setTimeout(() => {
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "";
      // console.log("userAuth", this.userAuth);
      // console.log("userUid", this.userUid);
      console.log("Const Main page");
      this.unsub = this.subUserInfo();
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

  startTalk(): {} {
    let t = {
      "member1": this.user.name,
      "member1DBid": this.user.idDB,
      "member2": this.otherChatUser.name,
      "member2DBid": this.otherChatUser.idDB,
      "communikation": [{
        "date": "heute",
        "messages": [{
          "name": this.user.name,
          "time": "20.19",
          "message": " Hallo das hier ist die gespeicherte Nachricht",
        }]
      }]
    }
    console.log(t);
    return t;
  }

  setUser(user: User) {
    this.otherChatUser = user;
    this.startTalk();
  }

  async updateID(id: string, coll: string) {
    let docRef = doc(this.firestore, coll, id);
    await updateDoc(docRef, { "idDB": id }).catch(
      (err) => { console.log(err); });
  }


  async addTalk(item: {}) {
    await addDoc(this.userRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            this.idDoc = docRef.id;
            this.updateID(this.idDoc, 'talk');
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
      this.userList = [];
      list.forEach(elem => {

      });
      console.log('logged in User', this.user);
      console.log('UserList', this.userList);
      // console.log('gameData anzeigen', this.userList);
    });
  }


}
