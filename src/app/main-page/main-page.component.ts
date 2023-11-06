import { Component, inject, OnChanges, ViewChild } from '@angular/core';
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
  // private unsub: any;
  // private unsubtalk: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  public otherChatUser: User = new User();
  // private currentTalkId: string = "";
  // public currentTalkData: any = this.createEmptyTalk();
  // public text: string = "";
  // public textEdit: string = "";
  public exist = false;
  public talkOpen: boolean = false;
  public openEditDialog: boolean = false;
  public openEdit: boolean = false;
  public setUser: boolean = false;
  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;

  constructor(public authService: AuthService, public router: Router) {   
  }

 

  setOtherUser(user: User) {
    this.talkOpen = true;
    this.otherChatUser = user;
    this.setUser = !this.setUser;
    this.child.setOtherUser(user);   
  }

  setOpen(value: boolean) {
    this.openChat = value;
  }  

  setUserList(uL: any) {    
    this.userList = uL;
  }

  setLoggedInUser(u: any) {    
    this.user= u;
  }


}

