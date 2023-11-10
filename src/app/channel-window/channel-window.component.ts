import { Component, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { User } from 'src/moduls/user.class';
import { EditChannelComponent } from '../edit-channel/edit-channel.component';

@Component({
  selector: 'app-channel-window',
  templateUrl: './channel-window.component.html',
  styleUrls: ['./channel-window.component.scss']
})
export class ChannelWindowComponent {
  public textThread = "";
  @Input() number: number = 0;
  showEmojis: boolean | undefined;
  private chathelper: ChatHepler = new ChatHepler();
  @Input() threadList: any[] = [this.chathelper.createEmptyThread()];
  @Input() user: User = new User();//authenticated user
  @Input() userList: User[];
  public threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  @Output() newItemEventChannel = new EventEmitter<ThreadConnector>();
  constructor(public dialog: MatDialog) {
    console.log("threadlist channel", this.threadList);
    setTimeout(() => {
      console.log("threadlist channel", this.threadList);
    }, 500);
  }

  openDialog(matDialogRef: TemplateRef<any>) {
    this.dialog.open(matDialogRef, { panelClass: 'dialog-bor-to-le-none' });
  }

  saveEmoji(e: { emoji: { unified: string; }; }) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    this.textThread += emoji;
    console.log(emoji);
    this.toggleEmojisDialog();
  }

  toggleEmojisDialog() {
    this.showEmojis = !this.showEmojis;
  }

  getTimeLastAnswer(thread: any) {
    let lastIndex = thread.answer.length - 1;
    if (lastIndex == -1) { return 0; }
    return thread.answer[lastIndex].time;
  }

  openThisThread(n: number, i: number, j: number) {
    console.log("number:" + n + " communikation:" + i + "  ThreadIndex:" + j);
    this.threadC.setValue(n, i, j);
    // this.openChat = true;
    this.newItemEventChannel.emit(this.threadC);

  }

  getIconPathQuestionUser(id:string) {
  
    let path = "";
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path = u.iconPath;
      }
    });
    if (this.user.idDB == id) { path = this.user.iconPath; }
    return path;
  }

  sendQuestion(indexCannel: number) {
    let communikationLastIndex = this.threadList[indexCannel].communikation.length - 1;
    let lastdate = this.threadList[indexCannel].communikation[communikationLastIndex].date;
    let today = this.chathelper.parseDate(new Date(Date.now()));
    let threadId=this.threadList[indexCannel].channel.idDB; 

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
      this.chathelper.updateDB(threadId, "thread", { "communikation": th });
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
      this.chathelper.updateDB(threadId, "thread", { "communikation": this.threadList[indexCannel].communikation });
    }
    this.textThread = "";
  }

}
