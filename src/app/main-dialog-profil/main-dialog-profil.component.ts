import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { User } from 'src/moduls/user.class';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { Router } from '@angular/router';
import { ChatHepler } from 'src/moduls/chatHelper.class';

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
  @Input() screenWidth: number;
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  // private userUid: string = ""; //uid od the user
  private unsub: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  private chatHepler: ChatHepler = new ChatHepler();
  @Output() unsubscribe = new EventEmitter<boolean>();

  constructor(public authService: AuthService, public dialog: MatDialog, public router: Router) {

  }

  setUser(user: User) {
    this.user = user;
    this.updateUser(this.user.idDB);
  }

  userRef() {
    return collection(this.firestore, 'user');
  }

  openChoie() {
    this.choiceDialog = !this.choiceDialog;
  }

  openProfile() {
    //this.choiceDialog = !this.choiceDialog;
    this.profileOpen = true;
  }

  setOpen(open: boolean) {
    this.profileOpen = open;
  }

  async logOut() {
    this.user.status = "Inaktiv";
    // await this.updateUser(this.user.idDB);    
    let user = this.authService.getAuthServiceUser();
    if (user) {
      this.authService.logout().then((dat) => {
        this.chatHepler.updateDB(this.user.idDB, "user", this.user.toJSON());
        this.router.navigateByUrl("login");
        this.unsubscribe.emit(true);
        localStorage.removeItem("uid");
        localStorage.removeItem("google");

      })
        .catch((error) => {
          console.log("error", error);
        });;

    }
  }

  getSingleUserRef(docId: string) {
    return doc(this.firestore, 'user', docId);
  }

  async updateUser(id: string) {
    let docRef = this.getSingleUserRef(id)
    await updateDoc(docRef, this.user.toJSON()).then((data) => {
    }).catch(
      (err) => { console.log(err); });
  }

  mobileScreenWidth() {
    return this.screenWidth < 830;
  }
}
