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
  public error = false;
  public addresses = false;
  public dataUpload={"link":"","title":""};
 
  @Output() callOpenChannel = new EventEmitter<number>();
  @Output() callOpenTalk = new EventEmitter<User>();
  @Output() isOpen = new EventEmitter<boolean>();
  @Output() areaText = new EventEmitter<string>();
  @Output() areaTextPrivate = new EventEmitter<string>();
  @Output() inputCheck = new EventEmitter<any>();
  @Output() dataUploadPrivate = new EventEmitter<any>();
  @Output() dataUploadChannel = new EventEmitter<any>();

  toggleEmojisDialog() {
    this.showEmojis = !this.showEmojis;
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
      if (((u.name.toLowerCase().includes(st)) && (first == '@')) || ((u.email.toLowerCase().includes(st)) && (first == '@'))) {
        this.searchResultUser.push(u);
      }
    })
    if (((this.user.name.toLowerCase().includes(st)) && (first == '@')) || ((this.user.email.toLowerCase().includes(st)) && (first == '@'))) {
      this.searchResultUser.push(this.user);
    }
  }

  searchKey(searchT: string) {
    let st = searchT.toLowerCase();
    this.searchText = st;
    let first = st[0];
    st = st.substring(1) 
    this.searchResultUser = [];
    this.searchResulChannel = [],    
    this.searchNameOrmail(st, first);
    let num = -1;
    this.threadList.forEach((t) => {
      num++;     
      if ((t.channel.name.toLowerCase().includes(st)) && (first == '#')) {
        let info = { "name": t.channel.name, "num": num }
        this.searchResulChannel.push(info);
      }
    })
  }
  saveMessage() {
    this.error = true;
    setTimeout(() => {
      this.error = false;
    },2000);
  }


  callOpenChan(n: number) {
    this.callOpenChannel.emit(n);
    this.isOpen.emit(false);
    this.areaText.emit(this.text);
    let dat = {"link":this.dataUpload.link,"title":this.dataUpload.title};
    this.dataUploadChannel.emit(dat);
    this.dataUpload.link="";
    this.dataUpload.title="";
   
  }

  callOpenT(u: User) {   
    this.callOpenTalk.emit(u);
    this.isOpen.emit(false);
    this.areaTextPrivate.emit(this.text);
    let dat = {"link":this.dataUpload.link,"title":this.dataUpload.title};
    this.dataUploadPrivate.emit(dat);
    this.dataUpload.link="";
    this.dataUpload.title="";

   
  }

  chooseUser(u:User){
    this.text+= '@'+u.name;
    this.addresses =!this.addresses;   
  }

    /**
 * Saves the uploaded portrait.
 * @param event Uploaded file
 */
    async onSelect(event: any) {
      this.chathelper.onSelect(event,this.dataUpload);   
      }
  
      showBlendIn(){
        return this.dataUpload.link!="";
      }
      showLink(link:string){
        return link!="";
      }

      closeUpload(){
        this.dataUpload.link="";
        this.dataUpload.title="";
      } 
}
