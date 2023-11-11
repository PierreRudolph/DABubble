import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { User } from 'src/moduls/user.class';
import { CreateChannelDialogComponent } from '../create-channel-dialog/create-channel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { Firestore, addDoc, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  menuHidden: any | false;
  chPanelOpen: boolean | undefined;
  mesPanelOpen: boolean | undefined;
  public firestore: Firestore = inject(Firestore);
  private chathelper: ChatHepler = new ChatHepler();
  @Input() user: User = new User();
  @Input() userList = [this.user];
  public threadList = [{ "channel": { "name": "channelname" } }]// [this.chathelper.createEmptyThread()];
  @Output() newItemEventUser = new EventEmitter<User>();
  @Output() newItemEventChanel = new EventEmitter<any>();
  @Output() newItemEvent = new EventEmitter<boolean>();
  @Output() newItemEventThreadList = new EventEmitter<any>();
  public loaded: boolean = false;
  private madeChannel: any;
  private unsubChannel: any;

  constructor(public dialog: MatDialog) {
    console.log("threadist construktor", this.threadList);
    console.log("channel name", this.threadList[0].channel.name);
    this.unsubChannel = this.subChannelList()
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
              "idDB": channelId,
              "description": this.madeChannel.description,
              "members": this.madeChannel.members,
            }

            console.log("show c", c);
            this.chathelper.updateDB(channelId, 'thread', { "channel": c });
          }
        });

  }

  subChannelList() {
    let ref = this.threadRef();
    return onSnapshot(ref, (list) => {
      // this.threadList = [];
      let cl: any = []
      list.forEach(elem => {
        // this.threadList.push(elem.data());
        cl.push(elem.data());
      });
      this.threadList = cl;
      // this.addNewItem(this.userList);
      this.newItemEventThreadList.emit(this.threadList);
      console.log("threadlist", this.threadList);
    });

  }

  addNewItem(user: User) {
    this.newItemEventUser.emit(user);
    this.newItemEvent.emit(false);
  }

  openTalk(u: User) {
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
      console.log("muss noch erstellt werden");
      console.log("result", result);
      this.madeChannel = result;
      if (result != "") { this.addChannel(); }

    });
  }



  openChannel(n: number) {
    this.newItemEvent.emit(false);
    this.newItemEventChanel.emit(n);
  }

}
