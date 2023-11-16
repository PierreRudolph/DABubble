import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrivateMessageComponent } from '../private-message/private-message.component';
import { User } from 'src/moduls/user.class';
import { ChatHepler } from 'src/moduls/chatHelper.class';

@Component({
  selector: 'app-send-new-message',
  templateUrl: './send-new-message.component.html',
  styleUrls: ['./send-new-message.component.scss']
})
export class SendNewMessageComponent {
  public newMessOpen = false;
  public text = "";
  public searchText = "";
  public showEmojis = false;
  @Input() userList: any;
  @Input() public user: User = new User();//authenticated user
  private chathelper: ChatHepler = new ChatHepler();
  @Input() public threadList: any = [this.chathelper.createEmptyThread()];
  @Input() public talkList: any = [this.chathelper.createEmptyTalk()];
  searchResultUser: User[] = [];
  searchResulChannel: any[] = [];

  @Output() callOpenChannel = new EventEmitter<number>();
  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() isOpen= new EventEmitter<boolean>();
  @Output() areaText= new EventEmitter<string>();
  @Output() areaTextPrivate =new EventEmitter<string>();

  toggleEmojisDialog() {
    this.showEmojis =!this.showEmojis;
   }

  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    if (this.showEmojis) {
      this.text += emoji;
      this.toggleEmojisDialog();
    }
  }

  searchNameOrmail(st: string, first: string) {
    this.userList.forEach((u) => {
      if (((u.name.toLowerCase().includes(st)) && (first == '@'))||((u.email.toLowerCase().includes(st)) && (first == '@'))) {
        this.searchResultUser.push(u);
      }
    })
    if (((this.user.name.toLowerCase().includes(st)) && (first == '@'))||((this.user.email.toLowerCase().includes(st)) && (first == '@'))) {
      this.searchResultUser.push(this.user);
    }
  }

  searchKey(searchT: string) {
    let st = searchT.toLowerCase();
    this.searchText = st;
    let first = st[0];
    st = st.substring(1)
    console.log("first elem", first);
    this.searchResultUser = [];
    this.searchResulChannel = [],
    console.log("searchtext", st);
    this.searchNameOrmail(st, first);

    console.log(this.searchResultUser);
    let num = -1;
    this.threadList.forEach((t) => {
      num++;
      console.log("name ", t.channel.name.toLowerCase().includes(st) + " " + t.channel.name.toLowerCase())
      if ((t.channel.name.toLowerCase().includes(st)) && (first == '#')) {
        let info = {"name": t.channel.name, "num":num}
        this.searchResulChannel.push(info);
      }
    })
  }
  saveMessage() { }


  callOpenChan(n: number) {
    this.callOpenChannel.emit(n);
    this.isOpen.emit(false);
    this.areaText.emit(this.text);
  }

  callOpenT(u: User) {
    this.callOpenTalk.emit(u);
    this.isOpen.emit(false);
    this.areaTextPrivate.emit(this.text);
  }


  /**
   * Saves the message stored in currentTalkData to the database. If it is the first message, that is starts a new talk.
   */
  // saveMessage() {
  //   let mes = this.createMessageFromText(this.text);
  //   console.log(mes)
  //   if (!this.exist) {
  //     this.startTalk(mes);
  //     this.exist = true;
  //   }
  //   else {
  //     this.saveMessageExist(mes);
  //   }
  //   setTimeout(() => {
  //     this.chatHepler.updateDB(this.currentTalkId, "talk", this.currentTalkData);
  //   }, 750);
  //   this.text = "";
  // }
}
