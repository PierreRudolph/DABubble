import { Component, inject, OnChanges, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { ChatHepler } from 'src/moduls/chatHelper.class';

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
  public setUser: boolean = false;
  public currentThreadId: string = "";
  private chathelper: ChatHepler = new ChatHepler();
  public threadList: any = [this.chathelper.createEmptyThread()];
  public unsub: any;
  public number: number = 0;
  public channelOpen = false;
  public textThread = "";
  public load = false;


  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;

  constructor(public authService: AuthService, public router: Router) {
    // let testThread = this.chathelper.createEmptyThread();    
    // let descr = "Dieser Channel ist für alles rund um #dfsdf vorgesehen."+
    //            "Hier kannst du zusammen mit deinem Team Meetings abhalten, Dokumente teilen und Entscheidungen treffen."; 
    // testThread.channel.description = descr; 
    // testThread.channel.name = "Entwicklerteam";
    // testThread.channel.members = [{
    //   "memberName": "Julia Wessolleck",
    //   "memberID": "L1epYhYXaDBVZEm1JJlB",
    // }]; 
    // console.log("testThread",testThread);
    // setTimeout(()=>{
    //   this.addThread(testThread);
    // },3000);

    this.unsub = this.subUserInfo();
    ;
  }

  setChannelNumber(number: number) {
    this.number = number;
    this.channelOpen = true;
    this.currentThreadId = this.threadList[number].channel.idDB;
    console.log("current thread number is", this.currentThreadId);
  }

  setOtherUser(user: User) {
    this.talkOpen = true;
    this.channelOpen = false;
    console.log("exist", this.exist);

    setTimeout(() => {
      this.otherChatUser = user;
      this.setUser = !this.setUser;
      this.child.setOtherUser(user);
    }, 500);

  }

  subUserInfo() {
    let ref = this.threadRef();
    return onSnapshot(ref, (list) => {
      // this.threadList = [];
      let th: any = []
      list.forEach(elem => {
        // this.threadList.push(elem.data());
        th.push(elem.data());
      });
      this.threadList = th;
      // this.addNewItem(this.userList);

      console.log("threadlist", this.threadList);
    });

  }

  threadDate(number: number, index: number) {
    let date = this.threadList[number].communikation[index].date
    // console.log("thread", this.threadList[number].communikation[index].date);
    return date;
  }

  threadData(number: number, index: number, indexTh: number, dataName: string) {
    let data = this.threadList[number].communikation[index].threads[indexTh][dataName];
    // console.log("thread", this.threadList[number].communikation[index].threads[indexTh][dataName]);
    return data;
  }

  async addThread(item: any) {

    await addDoc(this.threadRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            this.currentThreadId = docRef.id;
            let c =
            {
              "name": item.channel.name,
              "idDB": this.currentThreadId,
              "description": item.channel.description,
              "members": item.channel.members,
            };
            console.log(c);
            this.updateDB(this.currentThreadId, 'thread', { "channel": c });
          }
        });
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

  sendQuestion(indexCannel: number) {
    let communikationLastIndex = this.threadList[indexCannel].communikation.length - 1;
    let lastdate = this.threadList[indexCannel].communikation[communikationLastIndex].date;
    let today = this.chathelper.parseDate(new Date(Date.now()))
    console.log("Last date", lastdate + " " + today);

    let thread = {
      "name": this.user.name,
      "iD": this.user.idDB, //of person that writes the message
      "edit": false,
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "message": this.textThread,
      "answer": [
        {
          "name": "",
          "iD": "", //of person that writes the message
          "edit": false,
          "time": "",
          "message": "",
        }
      ]
    }

    if (today == lastdate) {
      // this.threadList[indexCannel].communikation[index].threads.push(thread); 
      // let th = this.threadList[indexCannel].communikation;    
      // console.log("upload data ", th);
      // this.updateDB(this.currentThreadId,"thread",{"communikation": th});
    }
    else {
      let c = {
        "date": today,
        "threads": [thread]
      }

      this.threadList[indexCannel].communikation.push(c);
      this.updateDB(this.currentThreadId, "thread", { "communikation": this.threadList[indexCannel].communikation });
    }

  }
}

