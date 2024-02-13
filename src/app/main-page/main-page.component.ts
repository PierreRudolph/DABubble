import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { DocumentData, Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
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
  public channelNumber: number = 0;
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  unsubChannel: any
  private unsub: any;
  private unsubtalk: any;
  loaded = false;
  public currentTalkData: any = [];
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
  @ViewChild(PrivateMessageComponent) childPrivateMes: PrivateMessageComponent;
  @ViewChild(ChannelWindowComponent) childChannel: ChannelWindowComponent;
  @ViewChild(SideMenuComponent) sideMenu: SideMenuComponent;
  @ViewChild(SideMenuThreadComponent) childSideThread: SideMenuThreadComponent;

  constructor(public authService: AuthService, public router: Router, private changeDetector: ChangeDetectorRef, public screen: ScreenService) {
    this.prepareUserData();
    this.assignAndActivateObservables();
  }



  /**
   * this function assigns data of the actual logged in user to the Variables userAuth and userUid
   */
  async prepareUserData() {
    this.userAuth = await this.authService.getAuthServiceUser();
    this.userUid = this.userAuth ? this.userAuth._delegate.uid : localStorage.getItem('uid');
  }


  /**
   * this function Activate and Assign Observables, to variables, to make them unsubscribeable.
   */
  assignAndActivateObservables() {
    this.unsub = this.subUserInfo();
    this.unsubtalk = this.subTalkInfo();
    this.unsubChannel = this.subChannelList();
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
      this.updateOtherUser(u);
      this.setUser(u);
      this.addUserToUserList(u)
    });
  }


  /**
   * this function keeps the actual otherChatUser's online status up To Date,
   * if private-message open and if given User's uid the same as the actual otherChatUser's uid
   * @param {User} u 
   */
  updateOtherUser(u: User) {
    if (this.childPrivateMes && (u.uid == this.otherChatUser.uid)) {
      this.otherChatUser.status = u.status;
    }
  }


  /**
   * sets the actual User
   * @param {User} user 
   * @returns stops here, if given user is not actual user
   */
  setUser(user: User) {
    if (!this.actualUser(user))
      return
    this.newGoogleUser = false;
    this.user = user;
    this.setActualUserActive(user);
  }


  /**
   * sets the actual user to status: Active and updates the Database
   * @param {User} user 
   */
  setActualUserActive(user: User) {
    if (user.status !== "Aktiv") {
      this.user.status = "Aktiv";
      this.updateUser(this.user.idDB);
    }
  }


  /**
   * add a User to the UserList Array
   * @param {Class} user
   */
  addUserToUserList(user: User) {
    if (this.actualUser(user))
      return;
    this.userList.push(user);
  }


  /**
   * @param {User} user 
   * @returns true if given user.uid same as this.userUid
   */
  actualUser(user: User) {
    return user.uid == this.userUid;
  }


  /**
   * update the User with the give user id
   * @param id given user Id
   */
  async updateUser(id: string) {
    let docRef = this.getSingleUserRef(id)
    await updateDoc(docRef, this.user.toJSON());
  }


  /**
   * @param docId given id of the document reference
   * @returns document reference found with given docId in the collection 'user'
   */
  getSingleUserRef(docId: string) {
    return doc(this.firestore, 'user', docId);
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
      this.user.status = "Aktiv";
      this.chathelper.addUser(this.user.toJSON());
    }
  }


  /**
  * Observes the database about changes on  all private talks of the current User.  
  * @returns Snapshot of all private talks of the current User.
  */
  subTalkInfo() {
    this.talkList = [];
    return onSnapshot(this.getCollectionRef('talk'), (list) => {
      list.forEach(talk => {
        this.updateCurrentTalkData(talk);
        this.pushToTalkList(talk);
      });
      this.checkIfTalkOpen();
    });

  }


  pushToTalkList(talk: QueryDocumentSnapshot<DocumentData>) {
    if (this.actualUserIsMember(talk)) {
      this.talkList.push(talk.data());
    }
  }


  actualUserIsMember(talk: QueryDocumentSnapshot<DocumentData>) {
    return talk.data()['member1DBid'] == this.user.idDB || talk.data()['member2DBid'] == this.user.idDB
  }


  /**
   * iterates thru talkList and updates the actual and open talk
   */
  checkIfTalkOpen() {
    this.talkList.forEach((talk: { idDB: string; member1DBid: string; member2DBid: string }) => {
      if (this.otherUserIsMember(talk) && (this.user.idDB !== this.otherChatUser.idDB) && this.childPrivateMes && this.otherChatUser.idDB != '') {
        this.currentTalkData = talk;
        this.currentTalkId = talk.idDB;
        this.childPrivateMes.exist = true;
        this.childPrivateMes.currentTalkId = talk.idDB;
      }
    })
  }


  otherUserIsMember(talk: { idDB: string; member1DBid: string; member2DBid: string; }) {
    return (talk.member1DBid == this.otherChatUser.idDB || talk.member2DBid == this.otherChatUser.idDB)
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
    return onSnapshot(this.getCollectionRef('thread'), (channels) => {
      this.threadList = [];
      channels.forEach(channel => {
        if (this.isUserInMemberList(channel.data())) {
          this.threadList.push(channel.data());
        }
      });
    });
  }


  /**
   * @param {string} refName 
   * @returns reference of the found collection
   */
  getCollectionRef(refName: string) {
    return collection(this.firestore, refName);
  }


  /**
   * 
   * @param {any}channel 
   * @returns true if actual user is member of the given channel
   */
  isUserInMemberList(channel: any) {
    let isMember: boolean = false;
    let memberList: any[] = channel.channel.members;//richtig wäre channel.info.members, gegebenenfalls noch ändern
    memberList.forEach((member) => {
      if (member.memberID == this.user.idDB) {
        isMember = true;
      }
    });
    return isMember;
  }


  /**
   * this function sets the newMessOpen boolean
   * @param {boolean} b 
   */
  setNewMessage(b: boolean) {
    this.newMessOpen = b;
  }


  /**
   * Is used by the Searchfunction. When clicked on the result the channel is opend, 
   * where the result can be found.
   * @param num  index of the current Cannel
   */
  callOpenChan(num: number) {
    this.setChannelNumber(num);
    this.currentThreadId = this.threadList[num].channel.idDB;
    this.setAllBolToShowChannel();
    this.showMainContentDivOn1400();
    this.scrollDownChannel();
  }


  /**
   *  Sets the required variables for visibility, of the channel-window
   */
  setAllBolToShowChannel() {
    this.setOpenChatBol(false);
    this.setPrivateOpenBol(false);
    this.setTalkOpenBol(false);
    this.setSideMenuNewMesBol(false);
    this.setChannelOpenBol(true);
  }


  /**
  * Sets the id of the current channel. 
  * @param number index of the Channel set should be openend
  */
  setChannelNumber(number: number) {
    this.channelNumber = number;

  }


  scrollDownChannel() {
    setTimeout(() => { this.childChannel.scrollDown(); }, 10);
  }


  /**
  * Is used by the Searchfunction. When clicked on the result the channel is opend, where the result can be found.
  *    
  * @param u  User with which you want to chat with.
  */
  openMessage(u: User) {
    this.sideMenu.newMessageMobile = true;
    this.sideMenu.openTalk(u);
    this.setSideMenuNewMesBol(false);
  }


  /**
   * transfers dataUpload coming from send-new-message, to channel-window
   * after 10 milliseconds to avoid calling channel-window before it is initialized
   * @param {JSON} dataUpload 
   */
  setdataUploadChannel(dataUpload: { link: string; title: string }) {
    setTimeout(() => { this.childChannel.dataUpload = dataUpload; }, 10);
  }


  /**
   * transfers dataUpload coming from send-new-message, to private-message
   * after 10 milliseconds to avoid calling private-message before it is initialized
   * @param {JSON} dataUpload 
   */
  setdataUploadPrivate(dataUpload: { link: string; title: string }) {
    setTimeout(() => { this.childPrivateMes.dataUpload = dataUpload; }, 10);
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
    this.setOpenChatBol(true);
  }


  setOpenValue(e: boolean) {
    this.showMainContentDivOn1400();

    this.setOpenChatBol(e);
    if (!this.openChat && this.sideMenuHidden) {
      this.setMobileSideMenuValues();
    }
  }


  /**
   * Set the other chatUser to given user and start the private talk.
   * @param user Ohter chat user
   */
  setOtherUser(user: User) {
    this.setTalkOpenBol(true);
    this.setChannelOpenBol(false);
    this.setPrivateOpenBol(true);
    this.setOpenChatBol(false);
    this.otherChatUser = user;

    setTimeout(() => {
      this.otherChatUser = user;
      this.childPrivateMes.setOtherUser(user);

    }, 10);
  }


  setCurrentTalkId(id: string) {
    this.currentTalkId = id;
    if (id != "") { this.oldTalkId = id; }
    this.currentTalkData.iD = id;
  }


  setOpen(value: boolean) {
    this.setOpenChatBol(value);

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
      this.childPrivateMes.text = areaText;
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
    this.setOpenChatBol(true);
    this.started = true;
    this.setPrivateOpenBol(false);
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
      this.setChannelOpenBol(false);
      this.mainContentDiv.nativeElement.classList.add('dNone');
    }
  }


  showMainContentDivOn1400() {
    if (!this.privateOpen) {
      this.setChannelOpenBol(true);
    }
    if (this.mainContentDiv) {
      this.mainContentDiv.nativeElement.classList.remove('dNone');
    }
  }


  hideMainContentDivOn830() {
    if (this.screen.screenWidth < 830) {
      this.setChannelOpenBol(false);
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


  openSideMenu() {
    this.sideMenu.openCloseSideMenu();
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
        this.setOpenChatBol(false);
      }, 200);
      return false;
    } else

      if (this.screen.screenWidth <= 1220 && this.channelOpen && this.sideMenuHidden) {
        setTimeout(() => {
          this.setOpenChatBol(false);
        }, 200);
        return false;
      }

      else {
        return true;
      }
  }


  setSideMenuNewMesBol(newValue: boolean) {
    this.sideMenu.newMessage = newValue;
  }


  setTalkOpenBol(newValue: boolean) {
    this.talkOpen = newValue;
  }


  setChannelOpenBol(newValue: boolean) {
    this.channelOpen = newValue;
  }


  setOpenChatBol(newValue: boolean) {
    this.openChat = newValue;
  }


  setPrivateOpenBol(newValue: boolean) {
    this.privateOpen = newValue
  }
}