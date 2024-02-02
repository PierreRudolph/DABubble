import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { DocumentData, Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, onSnapshot } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { SideMenuThreadComponent } from '../side-menu-thread/side-menu-thread.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ChannelWindowComponent } from '../channel-window/channel-window.component';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  public user: User = new User();//authenticated user
  //public gastID = "aFPvtx4nkhhF3IIAbvMP"
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  public otherChatUser: User = new User();
  public exist = false;
  public talkOpen: boolean = false;
  public currentThreadId: string = "";
  private chathelper: ChatHepler = new ChatHepler();
  public threadList: any = [this.chathelper.createEmptyThread()];
  public talkList: any = [this.chathelper.createEmptyTalk()];
  public channelOpen: boolean = false;
  public newMessOpen: boolean = true;
  public textThread = "";
  public areaText = "";
  public load = false;
  public privateOpen = false;
  public sideMenuHidden: boolean;
  public number: number = 0;
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  unsubChannel: any
  private unsub: any;
  private unsubtalk: any;
  loaded = false;
  public currentTalkData: any = this.chathelper.createEmptyTalk();
  private currentTalkId: string = "";
  public oldTalkId: string = "";
  private userAuth: any; //authenticated user
  private userUid: string = ""; //uid of the user
  public started = false;
  amountOfCall = 0;
  //idSet = false;
  private newGoogleUser = true;

  public storageList: Array<any> = [];

  @ViewChild('mainContentDiv') mainContentDiv: any;
  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;
  @ViewChild(ChannelWindowComponent) childChannel: ChannelWindowComponent;
  @ViewChild(SideMenuComponent) sideMenu: SideMenuComponent;
  @ViewChild(SideMenuThreadComponent) childSideThread: SideMenuThreadComponent;

  constructor(public authService: AuthService, public router: Router, private changeDetector: ChangeDetectorRef, public screen: ScreenService) {
    this.clearCommunikationOfCurrentTalkData();
    this.prepareUserData();
    this.assignAndActivateObservables();
  }


  /**
   * Clears the communikation Array inside the emptyTalkJSON
   */
  clearCommunikationOfCurrentTalkData() {
    this.currentTalkData.communikation = [];
  }


  /**
   * this function assigns data of the actual logged in user to the Variables userAuth and userUid
   */
  prepareUserData() {
    setTimeout(() => {
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : localStorage.getItem('uid');
    }, 1000);
  }


  /**
   * After given Time, this function Activate and Assign Observables, to variables, to make them unsubscribeable.
   */
  assignAndActivateObservables() {
    setTimeout(() => {
      this.unsub = this.subUserInfo();
      this.unsubtalk = this.subTalkInfo();
      this.unsubChannel = this.subChannelList();
    }, 1500);
  }


  /**
   * Observes the database about changes on  all Users.
   * @returns Snapshot of the userList and logged in User.
   */
  subUserInfo() {
    let userRef = this.getCollectionRef('user');
    return onSnapshot(userRef, (list) => {
      this.userList = [];
      this.findActualUserAndFillUserList(list)
      this.ifNewGoogleUserTrueCreateOne(this.userUid);
    });
  }


  /**
   * iterates thru the snapshot of firebase document, to search for actual user, add all other users to local userList array
   * if actual user found, give him status "active" and set Var googleUser to false, because if user was found it is no new google user
   * @param {QuerySnapshot<DocumentData>} list 
   */
  findActualUserAndFillUserList(list: any[] | QuerySnapshot<DocumentData>) {
    list.forEach(elem => {
      let u = new User(elem.data())
      if (u.uid == this.userUid) {
        this.newGoogleUser = false;
        this.user = u;
        this.user.status = "aktiv";

        // Firebase error wenn das erste mal mit einem google account angemeldet. /kein ersichtiler nutzen /auskommentiert am:30.1.24
        // if (!this.idSet) {
        //   this.chathelper.updateDB(this.user.idDB, "user", this.user.toJSON());
        //   this.idSet = true;
        // }

      } else { this.addUserToUserList(u) }
    });
  }


  /**
   * add a User to the UserList Array
   * @param {Class} user
   */
  addUserToUserList(user: User) {
    this.userList.push(user);
  }


  /**
   * when actual user was not found in userDB it is an new Google user, this function generates One
   * @param userUid 
   */
  ifNewGoogleUserTrueCreateOne(userUid: string) {
    if (this.newGoogleUser) {
      this.user = new User();
      this.user.uid = userUid;
      this.user.name = this.userAuth._delegate.displayName;
      this.user.email = this.userAuth._delegate.email;
      this.user.iconPath = "assets/img/Google.svg";
      this.user.status = "aktiv";
      this.chathelper.addUser(this.user.toJSON());
    }
  }


  /**
  * Observes the database about changes on  all private talks of the current User.  
  * 
  * @returns Snapshot of all private talks of the current User.
  */
  subTalkInfo() {
    let talkRef = this.getCollectionRef('talk');
    this.talkList = [];
    return onSnapshot(talkRef, (list) => {
      list.forEach(talk => {
        this.updateCurrentTalkData(talk);
        //Only talks of the current user are saved
        if (talk.data()['member1DBid'] == this.user.idDB || talk.data()['member2DBid'] == this.user.idDB) {
          this.talkList.push(talk.data());
        }
      });
    });
  }



  /**
   * updates the currentTalkData if the id of the found Talk is similiar to the currentTalkId
   * @param {QueryDocumentSnapshot<DocumentData>} talk 
   */
  updateCurrentTalkData(talk: QueryDocumentSnapshot<DocumentData>) {
    if (talk.id == this.currentTalkId) {
      this.currentTalkData = talk.data();
    }
  }


  /**
   * Observes the database about changes of all channel entries and threads.
   * 
   * @returns Snapshot of all channels and their associated threads.
   */
  subChannelList() {
    let threadRef = this.getCollectionRef('thread');
    return onSnapshot(threadRef, (list) => {
      let cl: any = []
      list.forEach(elem => {
        if (this.isUserInMemberList(elem.data())) {
          cl.push(elem.data());
        }
      });
      this.threadList = cl;

    });

  }





  /**
   * @param {string} refName 
   * @returns reference of the found collection
   */
  getCollectionRef(refName: string) {
    return collection(this.firestore, refName);
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
    this.privateOpen = false;
    setTimeout(() => { this.childChannel.scrollDown(); }, 500);


  }


  /**
  * Is used by the Searchfunction. When clicked on the result the channel is opend, where the result can be found.
  *    
  * @param u  User with which you want to chat with.
  */
  openMessage(u: User) {
    this.sideMenu.newMessageMobile = true;
    this.sideMenu.openTalk(u);
    this.sideMenu.newMessage = false;
  }


  setdataUploadChannel(dataUpload: any) {
    setTimeout(() => { this.childChannel.dataUpload = dataUpload; }, 500);
  }


  setdataUploadPrivate(dataUpload: any) {
    setTimeout(() => {
      this.child.dataUpload = dataUpload;
    }, 500);
  }


  /**   
   * @param h Sets wheather the sidemenu shoud be hidden or not
   */
  setSideMenuHidden(h: boolean) {
    this.sideMenuHidden = h;
  }


  /**
   * Sets the needed variables to find the current message.    
   * The structure of a channel entry can be found in ChatHepler(in modules) in the funtion createEmptyThread
   * 
   * @param n Index of the channel
   * @param i Index of the communication (every day where a smessage was written has an own communication)
   * @param j Index the message within a communication 
   */
  openThisThread(n: number, i: number, j: number) {
    this.threadC.setValue(n, i, j);
    this.openChat = true;
  }


  setOpenValue(e: boolean) {
    this.showMainContentDivOn1400();
    this.openChat = e;
    if (!this.openChat && this.sideMenuHidden) {
      this.setMobileSideMenuValues();
    }
  }


  /**
   * Sets the id of the current channel. Sets the required variables for visibility.
   * @param number index of the Channel set should be openend
   */
  setChannelNumber(number: number) {
    this.number = number;
    this.channelOpen = true;
    this.talkOpen = false;
    this.privateOpen = false;
    this.currentThreadId = this.threadList[number].channel.idDB;
    this.sideMenu.newMessage = false;

    this.showMainContentDivOn1400();
    setTimeout(() => { this.childChannel.scrollDown(); }, 500);
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

    //window.innerWidth = 1000; unser kleiner Fluch mit großen auswirkungen :)
    this.talkOpen = true;
    this.channelOpen = false;
    this.privateOpen = true;
    this.openChat = false;

    setTimeout(() => {
      this.otherChatUser = user;
      this.child.setOtherUser(user);

    }, 500);

  }


  setCurrentTalkId(id: string) {
    this.currentTalkId = id;
    if (id != "") { this.oldTalkId = id; }
    this.currentTalkData.iD = id;
  }


  setThreadList(list: any) {
    this.threadList = list;

  }

  //wird nie verwendet
  // setTalkList(tl: any) {
  //   this.talkList = tl;
  // }


  setOpen(value: boolean) {
    this.openChat = value;

    this.showMainContentDivOn1400();
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
    this.privateOpen = false;
    this.hideMainContentDivOn1400();
    this.hideMainContentDivOn830();
    setTimeout(() => {
      this.childSideThread.openSideMenuThread();
    }, 50);
  }


  setMobileView() {
    return !(this.screen.mobileScreenWidth() && !this.sideMenuHidden);
  }


  hideMainContentDivOn1400() {
    if (this.screen.screenWidth <= 1400 && this.screen.screenWidth > 830) {
      this.channelOpen = false;
      this.mainContentDiv.nativeElement.classList.add('dNone');
    }
  }


  showMainContentDivOn1400() {
    if (!this.privateOpen) {
      this.channelOpen = true;
    }
    if (this.mainContentDiv) {
      this.mainContentDiv.nativeElement.classList.remove('dNone');
    }
  }


  hideMainContentDivOn830() {

    if (this.screen.screenWidth < 830) {
      this.channelOpen = false;
      this.mainContentDiv.nativeElement.classList.add('dNone');
    }
  }


  toggleSideMenu(h: boolean) {
    this.sideMenuHidden = h;

    this.setMobileSideMenuValues();
    this.closeSideMenuThreadMobile();
  }


  showPrivateMessage() {
    return this.privateOpen && !this.newMessOpen;
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


  unsubscribe() {
    this.unsub();
    this.unsubtalk();
    this.unsubChannel();
  }



  setMobileThreadView() {

    if (this.screen.screenWidth > 1400) {
      return true;
    }

    if (this.screen.screenWidth <= 1400 && this.channelOpen && !this.sideMenuHidden) {
      setTimeout(() => {
        this.openChat = false;
      }, 200);
      return false;
    } else

      if (this.screen.screenWidth <= 1220 && this.channelOpen && this.sideMenuHidden) {
        setTimeout(() => {
          this.openChat = false;
        }, 200);
        return false;
      }

      else {
        return true;
      }
  }

  setChannelBoolean(boolean: boolean) {
    this.channelOpen = boolean;
  }
}