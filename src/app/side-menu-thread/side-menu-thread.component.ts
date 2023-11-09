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
  // public textThreadAnswerEdit = "";
  public editA = false;
  public editAIndex = 0;
  private answerIndex = 0;
  showEmojis: boolean | undefined;
  emojiText: string = "";

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

  setAnswerData(index: number, n: string, m: any) {
    this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index][n] = m;
  }

  showSmielie(index: number) {// ändern
    return 0 != this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index].smile;
  }

  getIconPathQuestionUser() {
    let id = this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].iD;
    let path = "";
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path = u.iconPath;
      }
    });
    if (this.user.idDB == id) { path = this.user.iconPath; }
    return path;
  }

  getImagePortrait(index: number) {
    let id = this.getAnswerData(index, 'iD');
    let path = "";
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path = u.iconPath;
      }
    });
    if (this.user.idDB == id) { path = this.user.iconPath; }
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
      "smile": [],
      "time": this.chathelper.parseTime(new Date(Date.now())),
      "message": this.textThreadAnswer,
    }
    if (this.editA) {
      this.threadList[n].communikation[i].threads[j].answer[this.editAIndex].message = this.textThreadAnswer;
    }
    else {
      this.threadList[n].communikation[i].threads[j].answer.push(answ);
    }

    console.log("Antwort", answ);
    console.log("comunikation", this.threadList[n].communikation[i]);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[n].communikation });
    this.textThreadAnswer = "";
    this.editA = false;
  }

  openAnswerMode(ans: any, index: number) {
    this.editA = true;
    this.textThreadAnswer = ans.message;
    this.editAIndex = index;
  }

  fromLoggedInUser(answer: any) {
    let uId = this.user.idDB;
    let aId = answer.iD;
    return (uId == aId);
  }

  saveEmoji(e: { emoji: { unified: string; }; }, index: number) {
    let unicodeCode: string = e.emoji.unified;
    let emoji = String.fromCodePoint(parseInt(unicodeCode, 16));
    let threadId = this.threadList[this.threadC.chNum].channel.idDB;
    // this.emojiText += emoji;//löschen

    let sm = this.getAnswerData(index, 'smile');
    console.log("smile", sm);
    let smileIndex =this.smileInAnswer(emoji,sm); 
    if(smileIndex==-1){
      let icon = {
        "icon": emoji,
        "users": [
          { "id": this.user.idDB }
        ]       
      };
      sm.push(icon);
    }else{
     let usersIcon =  sm[smileIndex].users;
     console.log("Icon exist",this.getIndexUserSmile(usersIcon));
     if(!this.getIndexUserSmile(usersIcon))  {
      sm[smileIndex].users.push( { "id": this.user.idDB });     
     }   
    }   
   
    this.setAnswerData(index, 'smile', sm);
    this.chathelper.updateDB(threadId, 'thread', { "communikation": this.threadList[this.threadC.chNum].communikation });
    this.toggleEmojisDialog();
    // console.log("anser", this.threadList[this.threadC.chNum].communikation[this.threadC.coIndex].threads[this.threadC.thIndex].answer[index]);
    this.answerIndex = index;

  }

  getIndexUserSmile(us:any[]){
    let ret=false;
    us.forEach((u)=>{
      if(u.id ==this.user.idDB){
        ret=true;
      }
    });

    return ret;
  }

  smileInAnswer(emoji: any, sm: any[]) {
    let b = -1;
    let i = -1;    
    sm.forEach((s) => { 
      i++;   
      if (s.icon == emoji) {
        b = i;
      }
    });
    return b;
  }


  toggleEmojisDialog() {
    this.showEmojis = !this.showEmojis;
  }

  showEmoji(aIndex: number) {
    return (this.answerIndex === aIndex) && this.showEmojis;
  }

}
