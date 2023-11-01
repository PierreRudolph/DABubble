import { Component ,inject} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  public idDoc = "";
  private userAuth: any; //authenticated user
  public user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  private userUid: string = ""; //uid od the user
  private unsub: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;

  constructor(public authService: AuthService, public router:Router) {
    setTimeout(() => {
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "";
      // console.log("userAuth", this.userAuth);
      // console.log("userUid", this.userUid);
      console.log("Const Main page");
      this.unsub = this.subGameInfo();
    }, 2000);
  }

  userRef() {
    return collection(this.firestore, 'user');
  }
  
  subGameInfo() {
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
      // console.log('logged in User', this.user);
      // console.log('gameData anzeigen', this.userList);
    });
  }


}
