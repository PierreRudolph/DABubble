import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Firestore, collection, doc, updateDoc } from '@angular/fire/firestore';
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
  @Input() user: User = new User();
  @Output() unsubscribe = new EventEmitter<boolean>();
  public firestore: Firestore = inject(Firestore);
  private chatHepler: ChatHepler = new ChatHepler();
  public choiceDialog: boolean = false;
  public profileOpen: boolean = false;

  constructor(public authService: AuthService, public router: Router, public screen: ScreenService) { }


  setUser(user: User) {
    this.user = user;
    this.updateUser(this.user.idDB);
  }


  async logOut() {
    this.user.status = "Inaktiv";
    this.logoutUser();
  }


  logoutUser() {
    this.authService.logout().then(async () => {
      this.unsubscribe.emit();
      await this.updateDatabase();
      this.clearLocalStorage();
      this.router.navigateByUrl("login");
    })
      .catch((error) => {
        console.log("error", error);
      });;
  }


  async updateDatabase() {
    await this.chatHepler.updateDB(this.user.idDB, "user", this.user.toJSON());
  }


  clearLocalStorage() {
    localStorage.removeItem("uid");
    localStorage.removeItem("google");
  }


  async updateUser(id: string) {
    let docRef = this.getSingleUserRef(id);
    await updateDoc(docRef, this.user.toJSON()).catch(
      (err) => { console.log(err); });
  }


  getSingleUserRef(docId: string) {
    return doc(this.firestore, 'user', docId);
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
}
