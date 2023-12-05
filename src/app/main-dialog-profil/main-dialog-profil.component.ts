import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { User } from 'src/moduls/user.class';
import { Router } from '@angular/router';
import { ChatHepler } from 'src/moduls/chatHelper.class';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-main-dialog-profil',
  templateUrl: './main-dialog-profil.component.html',
  styleUrls: ['./main-dialog-profil.component.scss']
})
export class MainDialogProfilComponent {
  public idDoc = "";
  @Input() user: User = new User();
  public firestore: Firestore = inject(Firestore);
  public userList: any;
  private unsub: any;
  public choiceDialog: boolean = false;
  public profileOpen = false;
  private chatHepler: ChatHepler = new ChatHepler();
  @Output() unsubscribe = new EventEmitter<boolean>();

  constructor(public authService: AuthService, public dialog: MatDialog, public router: Router, public screen: ScreenService) { }

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
    this.profileOpen = true;
  }

  setOpen(open: boolean) {
    this.profileOpen = open;
  }

  async logOut() {
   
    this.user.status = "Inaktiv";
    let user = this.authService.getAuthServiceUser();   
    if (user) {
      this.authService.logout().then((dat) => {
        this.chatHepler.updateDB(this.user.idDB, "user", this.user.toJSON());
        this.unsubscribe.emit(true);
        localStorage.removeItem("uid");
        localStorage.removeItem("google");
        this.router.navigateByUrl("login");

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
}
