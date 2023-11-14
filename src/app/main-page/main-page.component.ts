import { Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { SideMenuThreadComponent } from '../side-menu-thread/side-menu-thread.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {


  public user: User = new User();//authenticated user
  public gastID = "aFPvtx4nkhhF3IIAbvMP"
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  public otherChatUser: User = new User();
  public exist = false;
  public talkOpen: boolean = false;
  // public setUser: boolean = false;
  public currentThreadId: string = "";
  private chathelper: ChatHepler = new ChatHepler();
  public threadList: any = [this.chathelper.createEmptyThread()];
  public talkList: any = [this.chathelper.createEmptyTalk()];
  public channelOpen = false;
  public textThread = "";
  public textThreadEdit = "";
  public textThreadAnswer = "";
  public textThreadAnswerEdit = "";
  public load = false;
  public sideMenuHidden: boolean;
  //-----------------
  public number: number = 0;
  private iEdit = 0; //indizierung für Bearbeitung der Threads
  private jEdit = 0;
  private aAnswer = 0;
  //-----------------------
  private editT = false;
  private editA = false;
  private answerOpen = false;
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  unsubChannel: any
  private unsub: any;
  private unsubtalk: any;
  loaded = false;
  public currentTalkData: any = this.chathelper.createEmptyTalk();
  private currentTalkId: string = "";
  private userAuth: any; //authenticated user
  private userUid: string = ""; //uid od the user

  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;
  @ViewChild(SideMenuComponent) side: SideMenuComponent;
  @ViewChild(SideMenuThreadComponent) childSideThread: SideMenuThreadComponent;
  // @ViewChild(SideMenuThreadComponent) threadWindow: SideMenuThreadComponent;

  constructor(public authService: AuthService, public router: Router) {
    console.log("threadist construktor", this.threadList);
    console.log("channel name", this.threadList[0].channel.name);
    this.unsubChannel = this.subChannelList()
    console.log("current", this.currentTalkData);
    this.currentTalkData.communikation = [];
    setTimeout(() => {
      console.log("call construktor");
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "UnGujcG76FeUAhCZHIuQL3RhhZF3"; // muss wieder zu "" geändert werden
      this.unsub = this.subUserInfo(); 
    }, 1000);

    setTimeout(()=>{
      this.unsubtalk = this.subTalkInfo();
    },1500);
  }

    subUserInfo() {
    let ref = collection(this.firestore, 'user');
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
      // this.addNewItem(this.userList);
    });
  }

  subTalkInfo() {
    let ref = collection(this.firestore, 'talk');
    this.talkList=[];
    return onSnapshot(ref, (list) => {
      list.forEach(elem => {
        if (elem.id == this.currentTalkId) {
          this.currentTalkData = elem.data();          
          console.log("curretn talk sub", this.currentTalkData);
        }
        if(elem.data()['member1DBid']==this.user.idDB||elem.data()['member2DBid']==this.user.idDB)
        {
          this.talkList.push(elem.data());
        }
        
      });     
      // this.newItemEventTalkList.emit(this.talkList);
    });

  }  

  subChannelList() {
    let ref = this.threadRef();
    return onSnapshot(ref, (list) => {   
      let cl: any = []
      list.forEach(elem => {
      
        cl.push(elem.data());
      });
      this.threadList = cl;
    
    });

  }

  callOpenChan(num: number) {
    this.side.openChannel(num);
  }

  openMessage(u: User) {
    this.side.openTalk(u);
  }

  setSideMenuHidden(h: boolean) {
    this.sideMenuHidden = h;
  }

  openThisThread(n: number, i: number, j: number) {
    console.log("number:" + n + " communikation:" + i + "  ThreadIndex:" + j);
    this.threadC.setValue(n, i, j);
    this.openChat = true;

  }

  giveValue(v: number) {
    console.log(v);
  }

  setOpenValue(e: boolean) {
    this.openChat = e;
  }

  setChannelNumber(number: number) {
    this.number = number;
    this.channelOpen = true;
    this.talkOpen = false;
    this.currentThreadId = this.threadList[number].channel.idDB;
    console.log("current thread number is", this.currentThreadId);
    console.log("Threadli st", this.threadList);
  }

  isItMe() {
    return this.otherChatUser.idDB == this.user.idDB;
  }

  setOtherUser(user: User) {
    this.talkOpen = true;
    this.channelOpen = false;
    console.log("exist", this.exist);

    setTimeout(() => {
      this.otherChatUser = user;
      // this.setUser = !this.setUser;
      this.child.setOtherUser(user);
    }, 500);

  } 

  setThreadList(list: any) {
    this.threadList = list;
    // console.log("threadlist in main", this.threadList);
  }

  async updateDB(id: string, coll: string, info: {}) {

    let docRef = doc(this.firestore, coll, id);
    await updateDoc(docRef, info).then(
      () => { console.log("update", id); }
    ).catch(
      (err) => { console.log(err); });
  }

  threadRef() {
    return collection(this.firestore, 'thread');
  }

  setTalkList(tl: any) {
    this.talkList = tl;
  }

  setOpen(value: boolean) {
    this.openChat = value;
  }

  setUserList(uL: any) {
    this.userList = uL;
  }

  setLoggedInUser(u: any) {
    this.user = u;
  }

  editThreadAnswer(i: number, j: number, aIndex: number) {
    this.editA = !this.editA;
    this.iEdit = i;
    this.jEdit = j;
    this.aAnswer = aIndex;
    this.textThreadAnswerEdit = this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].answer[aIndex].message;
  }

  editThread(i: number, j: number) {
    this.editT = !this.editT;
    this.iEdit = i;
    this.jEdit = j;
    this.textThreadEdit = this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].message;
  }

  answerThread(i: number, j: number) { //später löschen
    this.textThreadAnswer = "";
    this.answerOpen = !this.answerOpen;
    this.iEdit = i;
    this.jEdit = j;
  }

  saveEdit() {
    console.log("Mess", this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].message);
    this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].message = this.textThreadEdit;
    console.log("Mess", this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].message);
    this.updateDB(this.currentThreadId, 'thread', { "communikation": this.threadList[this.number].communikation });
    this.editT = !this.editT;
  }

  saveAnswer() {  //löschen später
    let answ = {
      "name": this.user.name,
      "iD": this.user.idDB, //of person that writes the message
      "edit": false,
      "smile": [],
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "message": this.textThreadAnswer,
    }
    this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].answer.push(answ);
    console.log("Antwort", answ);
    console.log("comunikation", this.threadList[this.number].communikation[this.iEdit]);
    this.updateDB(this.currentThreadId, 'thread', { "communikation": this.threadList[this.number].communikation });
    this.answerOpen = !this.answerOpen;
  }

  saveEditAnswer() {
    console.log("Mess", this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].answer[this.aAnswer].message);
    this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].answer[this.aAnswer].message = this.textThreadAnswerEdit;
    console.log("Mess", this.threadList[this.number].communikation[this.iEdit].threads[this.jEdit].answer[this.aAnswer].message);
    this.updateDB(this.currentThreadId, 'thread', { "communikation": this.threadList[this.number].communikation });
    this.editA = !this.editA;
  }

  getEdit(i: number, j: number) {
    return (this.editT && (this.iEdit == i) && (this.jEdit == j))
  }
  getAnswer(i: number, j: number) {
    return (this.answerOpen && (this.iEdit == i) && (this.jEdit == j))
  }

  getEditAnswer(i: number, j: number, aIndex: number) {
    return (this.editA && (this.iEdit == i) && (this.jEdit == j) && (this.aAnswer == aIndex));
  }

  sendQuestion(indexCannel: number) {
    let communikationLastIndex = this.threadList[indexCannel].communikation.length - 1;
    let lastdate = this.threadList[indexCannel].communikation[communikationLastIndex].date;
    let today = this.chathelper.parseDate(new Date(Date.now()));

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
      this.updateDB(this.currentThreadId, "thread", { "communikation": th });
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
      this.updateDB(this.currentThreadId, "thread", { "communikation": this.threadList[indexCannel].communikation });
    }
    this.textThread = "";
  }

  setThreadC(c: ThreadConnector) {
    this.threadC = c;
    this.openChat = true;
    setTimeout(() => { this.childSideThread.drawer.open(); }, 250);

  }


}

