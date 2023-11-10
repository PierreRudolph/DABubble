import { Component, inject, OnChanges, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { SideMenuThreadComponent } from '../side-menu-thread/side-menu-thread.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {


  public user: User = new User();//authenticated user
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
  public channelOpen = false;
  public textThread = "";
  public textThreadEdit = "";
  public textThreadAnswer = "";
  public textThreadAnswerEdit = "";
  public load = false;
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


  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;
  @ViewChild(SideMenuThreadComponent) childSideThread: SideMenuThreadComponent;
  // @ViewChild(SideMenuThreadComponent) threadWindow: SideMenuThreadComponent;

  constructor(public authService: AuthService, public router: Router) {

  }

  openThisThread(n: number, i: number, j: number) {
    console.log("number:" + n + " communikation:" + i + "  ThreadIndex:" + j);
    this.threadC.setValue(n, i, j);
    this.openChat = true;

  }

  setOpenValue(e: boolean) {
    this.openChat = e;
  }

  setChannelNumber(number: number) {
    this.number = number;
    this.channelOpen = true;
    this.currentThreadId = this.threadList[number].channel.idDB;
    console.log("current thread number is", this.currentThreadId);
    console.log("Threadli st", this.threadList);
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

  // subUserInfo() {
  //   let ref = this.threadRef();
  //   return onSnapshot(ref, (list) => {
  //     // this.threadList = [];
  //     let th: any = []
  //     list.forEach(elem => {
  //       // this.threadList.push(elem.data());
  //       th.push(elem.data());
  //     });
  //     this.threadList = th;
  //     // this.addNewItem(this.userList);

  //     console.log("threadlist", this.threadList);
  //   });

  // }

  // threadDate(number: number, index: number) {
  //   let date = this.threadList[number].communikation[index].date
  //   // console.log("thread", this.threadList[number].communikation[index].date);
  //   return date;
  // }

  // threadData(number: number, index: number, indexTh: number, dataName: string) {
  //   let data = this.threadList[number].communikation[index].threads[indexTh][dataName];
  //   // console.log("thread", this.threadList[number].communikation[index].threads[indexTh][dataName]);
  //   return data;
  // }

  // async addThread(item: any) {

  //   await addDoc(this.threadRef(), item).catch(
  //     (err) => { console.error(err) }).then(
  //       (docRef) => {
  //         if (docRef) {
  //           this.currentThreadId = docRef.id;
  //           let c =
  //           {
  //             "name": item.channel.name,
  //             "idDB": this.currentThreadId,
  //             "description": item.channel.description,
  //             "members": item.channel.members,
  //           };
  //           console.log(c);
  //           this.updateDB(this.currentThreadId, 'thread', { "channel": c });
  //         }
  //       });
  // }

  setThreadList(list: any) {
    this.threadList = list;
    console.log("threadlist in main", this.threadList);
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
    this.childSideThread.drawer.open()

  }


}

