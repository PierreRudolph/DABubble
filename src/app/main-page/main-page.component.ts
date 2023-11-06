import { Component,  inject, OnChanges, ViewChild} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { PrivateMessageComponent } from '../private-message/private-message.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  private userAuth: any; //authenticated user
  public user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  private userUid: string = ""; //uid od the user
  private unsub: any;
  private unsubtalk: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  public otherChatUser: User = new User();
  private currentTalkId: string = "";
  // public currentTalkData: any = this.createEmptyTalk();
  public text: string = "";
  public textEdit: string = "";
  public exist = false;
  public talkOpen: boolean = false;
  public openEditDialog: boolean = false;
  public openEdit: boolean = false;
  public setUser:boolean=false;
  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;

  constructor(public authService: AuthService, public router: Router) {
    setTimeout(() => {
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "";
      this.unsub = this.subUserInfo();
      // this.unsubtalk = this.subTalkInfo();
    }, 2000);
  }

    subUserInfo() {
    let ref = this.userRef();
    return onSnapshot(ref, (list) => {
      this.userList = [];
      list.forEach(elem => {
        let u = new User(elem.data())
        if (u.uid == this.userUid) {
          this.user = u;
          this.user.status = "aktiv";
        }
        else { this.userList.push(u); }
      });
    });
  }

  setOtherUser(user: User) {
    this.talkOpen = true;
    this.otherChatUser = user;
    console.log(this.child);
    this.setUser = !this.setUser;
    this.child.setOtherUser(user);      
    this.unsub();
  }

    setOpen(value: boolean) {
    this.openChat = value;
  }

  userRef() {
    return collection(this.firestore, 'user');
  }


}

