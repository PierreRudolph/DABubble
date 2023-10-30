import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../auth.service';
import { User } from 'src/moduls/user.class';
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

  constructor(public authService: AuthService) {
    setTimeout(() => {
      this.userAuth = this.authService.getAuthServiceUser();
      this.userUid = this.userAuth ? this.userAuth._delegate.uid : "";
      console.log("userAuth", this.userAuth);
      console.log("userUid", this.userUid);
      this.unsub = this.subGameInfo();
    }, 1000);
  }

  subGameInfo() {
    let ref = this.userRef();
    return onSnapshot(ref, (list) => {
      this.userList = [];
      list.forEach(elem => {
        let u = new User(elem.data())
        if (u.uid == this.userUid) { this.user = u; }
        else { this.userList.push(u); }
      });
      console.log('logged in User', this.user);
      console.log('gameData anzeigen', this.userList);
    });
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

  // getSingleUserRef(docId: string) {
  //   return doc(this.firestore, 'user', docId);
  // }


  // async updateGame(id: string) {
  //   let docRef = this.getSingleUserRef(id)
  //   await updateDoc(docRef, { "idDB": id }).catch(
  //     (err) => { console.log(err); });
  // }

  userRef() {
    return collection(this.firestore, 'user');
  }
}
