import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { User } from 'src/moduls/user.class';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main-probe',
  templateUrl: './main-probe.component.html',
  styleUrls: ['./main-probe.component.scss']
})
export class MainProbeComponent {
  public idDoc = "";
  private userAuth: any; //authenticated user
  public user: User = new User();//authenticated user
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  private userUid: string = ""; //uid od the user
  private unsub: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;

  constructor(public authService: AuthService, public dialog: MatDialog, public router:Router) {
    setTimeout(() => {
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "";
      // console.log("userAuth", this.userAuth);
      // console.log("userUid", this.userUid);
      console.log("const mainProbe");
      this.unsub = this.subGameInfo();
    }, 2000);
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

  setUser(user: User) {
    this.user = user;
    console.log("received user",user);
    // this.updateName(this.user.idDB, this.user.name);
    // this.updateState(this.user.idDB, "email", this.user.email);
    this.updateUser(this.user.idDB);
  }

  userRef() {
    return collection(this.firestore, 'user');
  }

  openChoie() {
    this.choiceDialog = !this.choiceDialog;
  }

  openProfile() {
    this.choiceDialog = !this.choiceDialog;
    this.profileOpen = true;
  }

  setOpen(open: boolean) {
    this.profileOpen = open;
  }

  async logOut() {
    this.user.status="inaktiv";
     await this.updateUser(this.user.idDB);
    let user = this.authService.getAuthServiceUser();
    if (user) {
      this.authService.logout().then(() => {
        console.log("logged out");
        this.router.navigateByUrl("login");

         })
         .catch((error) => {
           // An error occurred
         });;
      console.log("userid is", user._delegate.uid);
    }
  }

  getSingleUserRef(docId: string) {
    return doc(this.firestore, 'user', docId);
  }

  async updateUser(id: string) {
    let docRef = this.getSingleUserRef(id)
    await updateDoc(docRef, this.user.toJSON()).catch(
      (err) => { console.log(err); });
  }

  // async addUser(item: {}) {
  //   await addDoc(this.userRef(), item).catch(
  //     (err) => { console.error(err) }).then(
  //       (docRef) => {
  //         if (docRef) {
  //           this.idDoc = docRef.id;
  //           this.updateGame(this.idDoc);
  //         }
  //       });
  // }
}





