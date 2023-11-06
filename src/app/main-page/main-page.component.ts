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

 
  public user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  public userList: any;  
  public choiceDialog: boolean = false;
  public profileOpen = false;
  public openChat = false;
  public otherChatUser: User = new User(); 
  public exist = false;
  public talkOpen: boolean = false;
  public setUser: boolean = false;
  public currentThreadId : string="";

  

  @ViewChild(PrivateMessageComponent) child: PrivateMessageComponent;

  constructor(public authService: AuthService, public router: Router) {
    let testThread = this.createEmptyThred();    
    let descr = "Dieser Channel ist für alles rund um #dfsdf vorgesehen."+
               "Hier kannst du zusammen mit deinem Team Meetings abhalten, Dokumente teilen und Entscheidungen treffen."; 
    testThread.channel.description = descr; 
    testThread.channel.name = "Entwicklerteam";
    testThread.channel.members = [{
      "memberName": "Julia Wessolleck",
      "memberID": "L1epYhYXaDBVZEm1JJlB",
    }]; 
    console.log("testThread",testThread);
    setTimeout(()=>{
      this.addThread(testThread);
    },3000);
  } 

  createEmptyThred():any {
    let t = {
      "channel":
      {
        "name": "",
        "idDB":"",
        "description": "",
        "members": [{
          "memberName": "",
          "memberID": "",
        }]
      },
      "communikation": [
        {
          "date": "",
          "threads": [
            {
              "name": "",
              "iD": "", //of person that writes the message
              "edit": false,
              "time": "",
              "message": "",
              "answer": [
                {
                  "name": "",
                  "iD": "", //of person that writes the message
                  "edit": false,
                  "time": "",
                  "message": "",
                }
              ]
            }
          ]
        }]
    }
    return t;
  }


  async addThread(item: any) {
   
    await addDoc(this.threadRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            this.currentThreadId = docRef.id;
            let c =  
            {
              "name": item.channel.name,
              "idDB":this.currentThreadId,
              "description": item.channel.description,
              "members": item.channel.members,
            };           
            console.log(c);
            this.updateDB(this.currentThreadId, 'thread',{"channel":c} );
          }
        });
  }

  async updateDB(id: string, coll: string, info: {}) {
   
    let docRef = doc(this.firestore, coll, id);
    await updateDoc(docRef, info).then(
      ()=>{  console.log("update", id);}
    ).catch(
      (err) => { console.log(err); });
  }

  threadRef() {
    return collection(this.firestore, 'thread');
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

