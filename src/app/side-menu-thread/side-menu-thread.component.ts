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
    console.log("userList thread ",this.userList + " id:"+id);
    this.userList.forEach((u) => {
      if (u.idDB == id) {
        path= u.iconPath;
      }
    });
    if(this.user.idDB==id)
    {path= this.user.iconPath;}
    console.log("path ",path);
    return path;
  }

  // showNUm() {
  //   console.log(" Output thread number:" + this.threadC.chNum + " communikation:" + this.threadC.coIndex + "  ThreadIndex:" + this.threadC.thIndex);
  //   console.log(this.threadC);
  //   console.log(this.threadList);

  // }
}
