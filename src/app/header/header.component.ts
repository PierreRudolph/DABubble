import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { User } from 'src/moduls/user.class';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() user: User = new User();//authenticated user 
  @Input() userList: any;
  private chathelper: ChatHepler = new ChatHepler();
  @Input() threadList: any = [this.chathelper.createEmptyThread()];
  @Input() talkList: any = [this.chathelper.createNewTalk]
  @Input() screenWidth: any;
  @Input() sideMenuHidden: boolean;
  private searchText: string = "";
  public threadTitleDec: any[] = [];
  public threadMessages: any[] = [];
  public talkMessages: any[] = [];
  public userInfos: any[] = [];
  public text = "";

  @Output() toggleSideMenu = new EventEmitter<boolean>();
  @Output() callOpenChannel = new EventEmitter<number>();
  @Output() callOpenTalk = new EventEmitter<User>();


  constructor(public router: Router) {
    window.addEventListener("resize", this.resizeWindow);
  }

  showPop() {
    return this.text != "";
  }

  resizeWindow() {
    this.screenWidth = window.innerWidth;
  }

  searchKey(text: string) {
    this.text = text;
    this.searchChannelNames(this.text);
    this.searchProfiles(this.text);
    this.searchChannelMessages(this.text);
    this.searchPrivateMess(this.text);
  }

  searchChannelNames(text: string) {
    let output = [];
    this.searchText = text.toLowerCase();
    let i = -1;
    this.threadList.forEach((t) => {
      i++;
      if (t.channel.name.toLowerCase().includes(this.searchText) || t.channel.description.toLowerCase().includes(this.searchText)) {
        let des = "";
        if (t.channel.description.toLowerCase().includes(this.searchText)) {
          des = this.makeSubstring(t.channel.description, 20)
        }
        output.push({ "name": t.channel.name, "index": i, "decription": des });
      }
    });
    console.log("output", output);
    this.threadTitleDec = output;
  }

  searchPrivateMess(text: string) {
    let output = [];
    this.searchText = text.toLowerCase();
    let num = -1;
    let cIndex = -1;
    let mIndex = -1
    console.log("talkList", this.talkList);
    this.talkList.forEach((ch) => {
      num++;
      ch.communikation.forEach((com) => {
        cIndex++;
        com.messages.forEach((mes) => {
          mIndex++;
          if (mes.message.toLowerCase().includes(this.searchText)) {
            output.push({
              "nameMem1": ch.member1, "nameMem2": ch.member2,
              "member1DBid": ch.member1DBid, "member2DBid": ch.member2DBid,
              "num": num, "cIndex": cIndex,
              "mIndex": mIndex, "message": mes.message, "time": mes.time
            });
          }
        });
        mIndex = -1;

      });
      cIndex = -1;
    });
    console.log("output", output);
    this.talkMessages = output;
  }

  getOtherUser(info: any) {
    let otherUser = new User();
    let m1 = info.member1DBid;
    let m2 = info.member2DBid;
    if (m1 == m2) { otherUser = this.user; }
    else {
      this.userList.forEach((ul) => {
        if ((ul.idDB == m1 && this.user.idDB == m2) || ul.idDB == m2 && this.user.idDB == m1) {

          otherUser = ul;
        }
      });

    }
    console.log("other user", otherUser);
    return otherUser;
  }


  callOpenChan(n: number) {
    this.callOpenChannel.emit(n);
  }

  callOpenT(u: User) {
    this.callOpenTalk.emit(u);
  }




  searchChannelMessages(text: string) {
    let output = [];
    this.searchText = text.toLowerCase();
    let num = -1;
    let cIndex = -1;
    let tIndex = -1
    this.threadList.forEach((ch) => {
      num++;
      ch.communikation.forEach((com) => {
        cIndex++;
        com.threads.forEach((th) => {
          tIndex++;
          if (th.message.toLowerCase().includes(this.searchText)) {
            output.push({ "chanName": ch.channel.name, "num": num, "cIndex": cIndex, "tIndex": tIndex, "name": th.name, "message": th.message, "time": th.time });
          }
        });
        tIndex = -1;

      });
      cIndex = -1;
    });
    // console.log("output", output);
    this.threadMessages = output;
  }

  getdate(info: any) {
    return this.threadList[info.num].communikation[info.cIndex].date;
  }

  getdateTalk(info: any) {
    return this.talkList[info.num].communikation[info.cIndex].date;
  }


  makeSubstring(s: string, len: number) {

    let l = s.length;
    let min = Math.min(l, len);
    let sub = s.substring(0, min);
    // console.log("messageSub is", sub);
    return sub;
  }

  searchProfiles(text: string) {
    let output = [];
    this.searchText = text.toLowerCase();
    let i = -1;
    this.userList.forEach((t) => {
      i++;
      if (t.name.toLowerCase().includes(this.searchText) || t.email.toLowerCase().includes(this.searchText)) {
        output.push(t);
      }
    });
    if (this.user.name.toLowerCase().includes(this.searchText) || this.user.email.toLowerCase().includes(this.searchText)) {
      output.push(this.user);
    }
    // console.log("output", output);
    this.userInfos = output;
  }

  emitToggleSideMenu() {
    this.sideMenuHidden = !this.sideMenuHidden;
    this.toggleSideMenu.emit(this.sideMenuHidden);
  }

  showNormalHeader() {
    console.log("screenwidth", window.innerWidth);
    // return (this.screenWidth < 471 && !this.sideMenuHidden) || this.screenWidth > 471;
    return (window.innerWidth < 471 && !this.sideMenuHidden) || window.innerWidth > 471;
  }

  showMobileHeader() {
    return this.screenWidth < 471 && this.sideMenuHidden;
  }
}
