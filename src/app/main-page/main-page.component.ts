import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { SideMenuThreadComponent } from '../side-menu-thread/side-menu-thread.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { retry } from 'rxjs';
import { ChannelWindowComponent } from '../channel-window/channel-window.component';

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
  public channelOpen: boolean = false;
  public newMessOpen: boolean = true;
  public textThread = "";
  public areaText = "";
  public load = false;
  public sideMenuHidden: boolean;
  //-----------------
  public number: number = 0;
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  unsubChannel: any
  private unsub: any;
  private unsubtalk: any;
  loaded = false;
  public currentTalkData: any = this.chathelper.createEmptyTalk();
  private currentTalkId: string = "";
  private userAuth: any; //authenticated user
  private userUid: string = ""; //uid od the user
  public started = false;
  public screenWidth: any;

  @ViewChild('mainContentDiv') mainContentDiv: any;
  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;
  @ViewChild(ChannelWindowComponent) childChannel: ChannelWindowComponent;
  @ViewChild(SideMenuComponent) sideMenu: SideMenuComponent;
  @ViewChild(SideMenuThreadComponent) childSideThread: SideMenuThreadComponent;
  // @ViewChild(SideMenuThreadComponent) threadWindow: SideMenuThreadComponent;

  constructor(public authService: AuthService, public router: Router) {
    console.log("threadist construktor", this.threadList);
    console.log("channel name", this.threadList[0].channel.name);
    console.log("current", this.currentTalkData);
    this.currentTalkData.communikation = [];

    setTimeout(() => {
      console.log("call construktor");
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "UnGujcG76FeUAhCZHIuQL3RhhZF3"; // muss wieder zu "" geändert werden      
      this.unsub = this.subUserInfo();
    }, 1000);

    setTimeout(() => {
      this.unsubtalk = this.subTalkInfo();
      this.unsubChannel = this.subChannelList();
    }, 1500);

    console.log("private comp", this.child);

    this.getScreenWidth();

  }


  /**
   * Observes the database about changes on  all Users.
   * 
   * @returns Snapshot of the userList and logeed in User.
   */
  subUserInfo() {
    let ref = collection(this.firestore, 'user');
    return onSnapshot(ref, (list) => {
      this.userList = [];
      let google = true;
      list.forEach(elem => {
        let u = new User(elem.data())
        if (u.uid == this.userUid) {
          this.user = u;
          this.user.status = "Aktive";
          google = false;
          console.log("userdats",this.user);
          this.chathelper.updateDB(this.user.idDB,"user",this.user.toJSON())
        }
        else { this.userList.push(u); }
      });
      if (google) {
        this.createGoogleUser(this.userUid);
      }
    });
  }

  createGoogleUser(userUid: string) {
    this.user = new User();
    this.user.uid = userUid;
    this.user.name = this.userAuth._delegate.displayName;
    this.user.email = this.userAuth._delegate.email;
    this.user.iconPath = "assets/img/Google.svg";
    this.user.status = "aktiv";
    console.log("googleName", this.user.name);
    this.chathelper.addUser(this.user.toJSON());

  }

  /**
  * Observes the database about changes on  all private talks of the current User.  
  * 
  * @returns Snapshot of all private talks of the current User.
  */
  subTalkInfo() {
    let ref = collection(this.firestore, 'talk');
    this.talkList = [];
    return onSnapshot(ref, (list) => {
      console.log("id of the talk is", this.currentTalkId);
      list.forEach(elem => {
        if (elem.id == this.currentTalkId) {
          this.currentTalkData = elem.data();
          console.log("curretn talk sub", this.currentTalkData);
        }
        //Only talks of the current user are saved
        if (elem.data()['member1DBid'] == this.user.idDB || elem.data()['member2DBid'] == this.user.idDB) {
          this.talkList.push(elem.data());
        }
      });
    });
  }

  /**
   * Observes the database about changes of all channel entries and threads.
   * 
   * @returns Snapshot of all channels and their associated threads.
   */
  subChannelList() {
    let ref = collection(this.firestore, 'thread');
    return onSnapshot(ref, (list) => {
      console.log("change channel");
      let cl: any = []
      list.forEach(elem => {
        if (this.isUserInMemberList(elem.data())) {
          cl.push(elem.data());
        }
      });
      this.threadList = cl;

    });

  }

  isUserInMemberList(channel: any) {
    let b = false;
    let list: any[] = channel.channel.members;
    list.forEach((m) => {
      if (m.memberID == this.user.idDB) {
        b = true;
      }
    });
    return b;
  }

  setNewMessage(b: boolean) {
    this.newMessOpen = b;
  }

  /**
   * Is used by the Searchfunction. When clicked on the result the channel is opend, where the result can be found.
   *    
   * @param num  index of the current Cannel
   */
  callOpenChan(num: number) {
    this.setChannelNumber(num);
    this.openChat = false;

  }

  /**
  * Is used by the Searchfunction. When clicked on the result the channel is opend, where the result can be found.
  *    
  * @param u  User with which you want to chat with.
  */
  openMessage(u: User) {
    this.sideMenu.openTalk(u);
    this.sideMenu.newMessage = false;
  }

  /**   
   * @param h Sets wheather the sidemenu shoud be hidden or not
   */
  setSideMenuHidden(h: boolean) {
    this.sideMenuHidden = h;
  }

  /**
   * Sets the needed variables to find the current message.    
   * The structure of a channel entry can be found in ChatHepler(in moduleds) in the funtion createEmptyThread
   * 
   * @param n Index of the channel
   * @param i Index of the communication (every day where a smessage was written has an own communication)
   * @param j Index the message within a communication 
   */
  openThisThread(n: number, i: number, j: number) {
    this.threadC.setValue(n, i, j);
    this.openChat = true;
  }

  // giveValue(v: number) {
  //   console.log(v);
  // }

  setOpenValue(e: boolean) {
    this.openChat = e;
    if (!this.openChat && this.sideMenuHidden) {
      this.setMobileSideMenuValues();
    }

    //this.closeSideMenuThreadMobile();
  }
  /**
   * Sets the id of the current channel. Sets the required variables for visibility.
   * @param number index of the Channel set should be openend
   */
  setChannelNumber(number: number) {
    this.number = number;
    this.channelOpen = true;
    this.talkOpen = false;
    this.currentThreadId = this.threadList[number].channel.idDB;
    this.sideMenu.newMessage = false;
  }

  /**  
   * @returns Am i talking to myself?
   */
  isItMe() {
    return this.otherChatUser.idDB == this.user.idDB;
  }

  /**
   * Setz the other chatUser to u and start the private talk.
   * @param user Ohter chat user
   */
  setOtherUser(user: User) {
    this.talkOpen = true;
    this.channelOpen = false;
    setTimeout(() => {
      this.otherChatUser = user;
      console.log("other user", this.otherChatUser);
      // this.setUser = !this.setUser;
      this.child.setOtherUser(user);
    }, 750);

  }

  setCurrentTalkId(id:string){
    console.log("curren talk ist",id);
    this.currentTalkId = id;
  }

  setThreadList(list: any) {
    this.threadList = list;

  }

  setTalkList(tl: any) {
    this.talkList = tl;
  }

  setOpen(value: boolean) {
    this.openChat = value;
  }

  setLoggedInUser(u: any) {
    this.user = u;
    this.started = true;
  }

  setAreaText(areaText: string) {
    this.areaText = areaText;
    setTimeout(() => {
      this.childChannel.textThread = areaText;
    }, 1000);
  }

  setAreaTextPrivate(areaText: string) {
    this.areaText = areaText;
    setTimeout(() => {
      this.child.text = areaText;
    }, 1000);
  }

  /**
   * Opens the thread window for the given communication
   * 
   * @param c  Object, that contain all the needet data to pen the thread in SideMenuThreadComponent.
   * c is given to SideMenuThreadComponent, that needs the informations.
   */
  setThreadC(c: ThreadConnector) {
    this.threadC = c;
    this.openChat = true;
    this.started = true;
    setTimeout(() => {
      this.hideMainContentDivOnMobile();
      this.childSideThread.openSideMenuThread();
    }, 250);
  }


  getScreenWidth() {
    this.screenWidth = window.innerWidth;
  }


  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
  }

  setMobileView() {
    return !(this.screenWidth < 830 && !this.sideMenuHidden);
  }

  hideMainContentDivOnMobile() {
    if (this.screenWidth < 830) {
      this.mainContentDiv.nativeElement.classList.add('dNone');
    }

  }


  toggleSideMenu(h: boolean) {
    this.sideMenuHidden = h;
    // if (this.channelOpen) {
    //   this.setMobileSideMenuValues();
    // }
    this.setMobileSideMenuValues();
    this.closeSideMenuThreadMobile();
  }

  showPrivateMessage() {
    return !this.channelOpen && !this.newMessOpen;
  }

  showChannel() {
    return this.channelOpen && !this.newMessOpen;
  }

  setMobileSideMenuValues() {
    this.sideMenu.setDrawerValues();
  }

  closeSideMenuThreadMobile() {
    if (this.openChat) {
      this.childSideThread.closeThread();
    }
  }

  unsubscribe(u:boolean){
    this.unsub() ;
    this.unsubtalk ();
    this.unsubChannel();
}
}

