import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { User } from 'src/moduls/user.class';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { ScreenService } from '../screen.service';
import { SaveLastUserService } from '../save-last-user.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  public sideMenuHidden: boolean | true;
  public chPanelOpen: boolean | undefined;
  public mesPanelOpen: boolean | undefined;
  public firestore: Firestore = inject(Firestore);
  public loaded: boolean = true;
  public channelActive: number;
  private madeChannel: any;
  public chathelper: ChatHepler = new ChatHepler();
  public newMessage = false;
  @Input() user: User = new User();
  @Input() userList = [this.user];
  @Input() talkList: any = [this.chathelper.createEmptyTalk()];
  @Input() threadList = [this.chathelper.createEmptyThread()];
  @Output() isOpen = new EventEmitter<boolean>();
  @Output() newItemEventMenuHidden = new EventEmitter<boolean>();
  @Output() newItemEventUser = new EventEmitter<User>();
  @Output() newItemEventChanel = new EventEmitter<any>();
  @Output() newItemEvent = new EventEmitter<boolean>();

  @Output() channelOpen = new EventEmitter<boolean>();

  private dialogClasses: Array<string> = [];
  public threadTitleDec: any[] = [];
  public threadMessages: any[] = [];
  public talkMessages: any[] = [];
  public userInfos: any[] = [];
  public text = "";
  public newMessageMobile: boolean = false;
  @ViewChild('drawer') drawer: any;
  @ViewChild('sideMenuDiv') sideMenuDiv: any;

  constructor(public dialog: MatDialog, public screen: ScreenService, public lastUserService: SaveLastUserService) {
  }

  getName(num: number) {
    if (this.loaded) { return this.threadList[num].channel.name }
    else {
      return ""
    };
  }

  threadRef() {
    return collection(this.firestore, 'thread');
  }

  async addChannel() {
    let ch = this.chathelper.createEmptyThread();
    ch.channel = this.madeChannel;
    let channelId = "";
    ch.communikation[0].threads = [];
    await addDoc(this.threadRef(), ch).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            channelId = docRef.id;
            let c = {
              "name": this.madeChannel.name,
              "creator": this.madeChannel.creator,
              "idDB": channelId,
              "description": this.madeChannel.description,
              "members": this.madeChannel.members,
            }
            this.chathelper.updateDB(channelId, 'thread', { "channel": c });
          }
        });
  }


  addNewItem(user: User) {
    this.newItemEventUser.emit(user);
    this.newItemEvent.emit(false);
  }

  setNewMessage() {
    this.newMessage = true;
    this.isOpen.emit(this.newMessage);
  }


  openTalk(u: User) {
    this.newMessage = false;
    this.isOpen.emit(false);
    this.addNewItem(u);
    this.lastUserService.lastUser = u;

    if (!this.newMessageMobile) {
      this.setDrawerValues();
    }
    this.newMessageMobile = false;
  }

  getdate(info: any) {
    return this.threadList[info.num].communikation[info.cIndex].date;
  }

  getdateTalk(info: any) {
    return this.talkList[info.num].communikation[info.cIndex].date;
  }


  openCreateChannelDialog() {
    this.setCreateChannelDialogMobileStyle();
    let dialogRef = this.dialog.open(CreateChannelDialogComponent, { panelClass: this.dialogClasses });
    dialogRef.componentInstance.user = new User(this.user.toJSON());//Kopie
    dialogRef.componentInstance.userList = this.userList;//Kopie
    dialogRef.componentInstance.dialogReference = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      this.madeChannel = result;
      if (result && result != "") { this.addChannel(); }

    });
  }

  setCreateChannelDialogMobileStyle() {
    if (this.screen.mobileScreenWidth()) {
      this.dialogClasses = ['maxWidth100', 'dialogBorRadNone'];
    }

  }

  openChannel(n: number) {
    this.channelActive = n;
    this.newMessage = false;
    this.setDrawerValues();
    this.newItemEvent.emit(false);
    this.newItemEventChanel.emit(n);
    this.isOpen.emit(false);

    this.channelOpen.emit(true)
  }


  toggleDrawerBol() {
    this.sideMenuHidden = !this.sideMenuHidden;
    this.emitSideMenuHidden();
  }

  emitSideMenuHidden() {
    this.newItemEventMenuHidden.emit(this.sideMenuHidden);
  }

  openCloseSideMenu() {
    this.drawer.toggle();
    this.toggleDrawerBol()
    this.sideMenuDiv.nativeElement.classList.remove('dNone');
  }

  setDrawerValues() {
    if (this.screen.mobileScreenWidth() && this.sideMenuHidden) {
      this.drawer.toggle();
      this.toggleDrawerBol();
      setTimeout(() => { this.sideMenuDiv.nativeElement.classList.remove('dNone'); }, 80);
    } else
      if (this.screen.mobileScreenWidth() && !this.sideMenuHidden) {
        this.sideMenuDiv.nativeElement.classList.add('dNone');
        this.toggleDrawerBol();
        this.drawer.toggle();
      } else if (this.sideMenuHidden) {
        this.toggleDrawerBol();
        this.drawer.toggle();
      } else { }
  }

  searchKey(text: string) {
    this.text = text;
    this.searchChannelNames(this.text);
    this.searchProfiles(this.text);
    this.searchChannelMessages(this.text);
    this.searchPrivateMess(this.text);
  }

  searchChannelNames(text: string) {
    this.threadTitleDec = this.chathelper.searchChannelNames(text, this.threadList);
  }

  searchPrivateMess(text: string) {
    this.talkMessages = this.chathelper.searchPrivateMess(text, this.talkList);
  }

  searchProfiles(text: string) {
    this.userInfos = this.chathelper.searchProfiles(text, this.userList, this.user);
  }

  searchChannelMessages(text: string) {
    this.threadMessages = this.chathelper.searchChannelMessages(text, this.threadList);
  }

  showPop() {
    return this.text != "";
  }

  getOtherUser(info: any) {
    return this.chathelper.getOtherUser(info, this.userList, this.user);
  }
}

