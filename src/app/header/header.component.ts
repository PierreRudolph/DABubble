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
  private searchText: string = "";
  public threadTitleDec: any[] = [];
  public threadMessages: any[] = [];
  public userInfos: any[] = [];
  text = "Julia";

  @Output() callOpenChannel = new EventEmitter<number>();
  @Output() callOpenTalk = new EventEmitter<User>();
 
  
  constructor(public router: Router) {
    setTimeout(() => {
      this.searchChannelNames(this.text);
      this.searchProfiles(this.text);    
      this.searchChannelMessages(this.text);
      // this.searchProfiles("Jul");    
      // this.searchChannelMessages("Taylor ");
    }, 5000);
  }

  searchChannelNames(text: string) {
    let output = [];
    this.searchText = text.toLowerCase();
    let i = -1;
    this.threadList.forEach((t) => {
      i++;
      console.log("t is", t.channel.name);
      if (t.channel.name.toLowerCase().includes(this.searchText) || t.channel.description.toLowerCase().includes(this.searchText)) {
        output.push({ "name": t.channel.name, "index": i });
      }
    });
    console.log("output", output);
    this.threadTitleDec = output;
  }

  callOpenChan(n:number){
    this.callOpenChannel.emit(n);
  }

  callOpenT(u:User) {
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
            output.push({ "num": num, "cIndex": cIndex, "tIndex": tIndex ,"name" :th.name, "message": th.message , "time":th.time});
          }
        });
        tIndex=-1;

      });
      cIndex=-1;
    });
    console.log("output", output);
    this.threadMessages = output;
  }

  getdate(info:any){
   return this.threadList[info.num].communikation[info.cIndex].date;
  }

  makeSubstring(s:string, len:number){
    console.log("message is",s);
    let l = s.length;
    let min = Math.min(l,len);
    let sub = s.substring(0,min);
    console.log("messageSub is",sub);
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
    console.log("output", output);
    this.userInfos = output;
  }



  

}
