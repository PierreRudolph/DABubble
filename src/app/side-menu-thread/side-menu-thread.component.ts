import { Component, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ThreadConnector } from 'src/moduls/threadConnecter.class';
import { User } from 'src/moduls/user.class';
@Component({
  selector: 'app-side-menu-thread',
  templateUrl: './side-menu-thread.component.html',
  styleUrls: ['./side-menu-thread.component.scss']
})
export class SideMenuThreadComponent {
  i: 10 | number | undefined;

  @Input() userList: User[];
  @Input() user: User;
  private chathelper: ChatHepler = new ChatHepler();
  @Input() threadList: any = [this.chathelper.createEmptyThread()];
  @Input() threadC: ThreadConnector = new ThreadConnector(0, 0, 0);
  public textThreadEdit = "";
  public textThreadAnswer = "";
  public textThreadAnswerEdit = "";

  @ViewChild('drawer')
  drawer!: MatDrawer;

  closeThread() {
    this.drawer.close();
    console.log(this.drawer);
  }

  getAnswerLength() {
    return this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer.length;
  }

  getAnswerList() {
    return this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer
  }

  getAnswerData(index: number, n: string) {
    return this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index][n];
  }

  getImagePortrait(index: number) {
    let id = this.getAnswerData(index, 'iD');
    let path = "";   
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path= u.iconPath;
      }
    });
    if(this.user.idDB==id)
    {path= this.user.iconPath;}  
    return path;
  }

  saveAnswer() {
    let n = this.threadC.chNum;
    let i = this.threadC.coIndex;
    let j = this.threadC.thIndex;
    let threadId = this.threadList[n].channel.idDB;
    console.log("threadId", threadId)
    let answ = {
      "name": this.user.name,
      "iD": this.user.idDB, //of person that writes the message
      "edit": false,
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "message": this.textThreadAnswer,
    }
    this.threadList[n].communikation[i].threads[j].answer.push(answ);
    console.log("Antwort", answ);
    console.log("comunikation", this.threadList[n].communikation[i]);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[n].communikation });
    this.textThreadAnswer="";
  }

  fromLoggedInUser(answer:any){
      let uId= this.user.idDB;
      let aId = answer.iD;     
      return (uId==aId);
  }

  // answerThread(i: number, j: number) {
  //   this.textThreadAnswer = "";
  //   // this.answerOpen = !this.answerOpen;
  //   this.threadC.setValueIJ(i,j);
  // }

}
