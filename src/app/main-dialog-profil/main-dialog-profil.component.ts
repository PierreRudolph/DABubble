import { Component, inject, Input } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { User } from 'src/moduls/user.class';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dialog-profil',
  templateUrl: './main-dialog-profil.component.html',
  styleUrls: ['./main-dialog-profil.component.scss']
})
export class MainDialogProfilComponent {
  public idDoc = "";
  // private userAuth: any; //authenticated user
  // public user: User = new User();//authenticated user
  @Input() user: User = new User();
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  // private userUid: string = ""; //uid od the user
  private unsub: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;

  constructor(public authService: AuthService, public dialog: MatDialog, public router: Router) {
  
  } 

  setUser(user: User) {
    this.user = user;
    console.log("received user", user);
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
    this.user.status = "inaktiv";
    console.log("log out user data", this.user.idDB);
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
