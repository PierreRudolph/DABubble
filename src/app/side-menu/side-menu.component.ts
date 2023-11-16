import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { User } from 'src/moduls/user.class';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

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
  public loaded: boolean = false;
  public channelActive: number;
  private madeChannel: any;
  private chathelper: ChatHepler = new ChatHepler();
  public newMessage = false;
  @Input() user: User = new User();
  @Input() userList = [this.user];
  @Input() threadList = [{ "channel": { "name": "channelname" } }]// [this.chathelper.createEmptyThread()];
  @Input() screenWidth: number;
  @Output() isOpen = new EventEmitter<boolean>();
  @Output() newItemEventMenuHidden = new EventEmitter<boolean>();
  @Output() newItemEventUser = new EventEmitter<User>();
  @Output() newItemEventChanel = new EventEmitter<any>();
  @Output() newItemEvent = new EventEmitter<boolean>();

  @ViewChild('drawer') drawer: any;
  @ViewChild('sideMenuDiv') sideMenuDiv: any;

  constructor(public dialog: MatDialog) {
    setTimeout(() => {
      this.loaded = true; //wegen ladeproblemen
    }, 3000);
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
    console.log("new thread ", ch);
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

            console.log("show c", c);
            this.chathelper.updateDB(channelId, 'thread', { "channel": c });
          }
        });
  }


  addNewItem(user: User) {
    this.newItemEventUser.emit(user);
    this.newItemEvent.emit(false);
  }

  setNewMessage() {
    this.newMessage = !this.newMessage;
    console.log("value", this.newMessage);
    this.isOpen.emit(this.newMessage);

  }

  openTalk(u: User) {
    this.newMessage = false;
    this.isOpen.emit(false);
    this.setDrawerValues();
    console.log("openUserTalk", u);
    this.addNewItem(u);
  }

  openCreateChannelDialog() {
    // this.dialog.open(CreateChannelDialogComponent);
    // this.dialog.componentInstance();
    let dialogRef = this.dialog.open(CreateChannelDialogComponent);
    dialogRef.componentInstance.user = new User(this.user.toJSON());//Kopie
    dialogRef.componentInstance.userList = this.userList;//Kopie
    dialogRef.componentInstance.dialogReference = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      this.madeChannel = result;
      if (result != "") { this.addChannel(); }

    });
  }

  openChannel(n: number) {
    this.channelActive = n;
    this.newMessage = false;
    this.setDrawerValues();
    this.newItemEvent.emit(false);
    this.newItemEventChanel.emit(n);
    this.isOpen.emit(false);
  }


  toggleDrawerBol() {
    this.sideMenuHidden = !this.sideMenuHidden;
    this.emitSideMenuHidden();
  }

  emitSideMenuHidden() {
    this.newItemEventMenuHidden.emit(this.sideMenuHidden);
  }

  setDrawerValues() {
    if (this.screenWidth < 471 && this.sideMenuHidden) {
      this.drawer.toggle();
      this.toggleDrawerBol();
      setTimeout(() => { this.sideMenuDiv.nativeElement.classList.remove('dNone'); }, 120);
    } else
      if (this.screenWidth < 471 && !this.sideMenuHidden) {
        this.sideMenuDiv.nativeElement.classList.add('dNone');
        this.toggleDrawerBol();
        this.drawer.toggle();
      } else {
        this.sideMenuDiv.nativeElement.classList.remove('dNone');
      }
  }
}

