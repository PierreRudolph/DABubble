import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-create-account-avatar',
  templateUrl: './create-account-avatar.component.html',
  styleUrls: ['./create-account-avatar.component.scss']
})
export class CreateAccountAvatarComponent {

  @Input() name: string = "";
  @Input() user: User = new User();

  public padding: boolean = true;
  public hide: boolean = true;
  public move: boolean = false;
  public wait: boolean = false;
  public portraitPath = "assets/img/person.svg";
  public firestore: Firestore = inject(Firestore);
  public idDoc = "";

  constructor(public authService: AuthService, private router: Router) {
    let u = authService.getAuthServiceUser();
    console.log("mein user", u);
    // setTimeout(() => { this.user.name = "Laura Schröder"; }, 125);

  }

  register() {
    this.wait = true;
    console.log(this.user);
    this.authService.signUp(this.user.email, this.user.password).then((res) => {
      this.hide = false;
      this.move = true;
      this.user.password = "";
      let userAny: any = res;
      let id = userAny.user._delegate.uid;     
      this.user.uid = id;
     
      this.addUser(this.user.toJSON());
      setTimeout(() => {
        this.hide = true;
        this.move = false;
        this.wait = false;

        this.router.navigateByUrl('/login');
      }, 2500);
    })
      .catch((error) => {
        this.wait = false;
        console.log("register fail", error);
      })
  }

  async addUser(item: {}) {
    await addDoc(this.userRef(), item).catch(
      (err) => { console.error(err) }).then(
        (docRef) => {
          if (docRef) {
            this.idDoc = docRef.id;           
            this.updateGame(this.idDoc);
          }
        });
  }

  getSingleUserRef(docId: string) {
    return doc(this.firestore, 'user', docId);
  }


  async updateGame(id: string) {
    let docRef = this.getSingleUserRef(id)
    await updateDoc(docRef, { "idDB": id }).catch(
      (err) => { console.log(err); });
  }


  userRef() {
    return collection(this.firestore, 'user');
  }


  setPortraitPath(path: string) {
    this.user.iconPath = path;
    this.portraitPath = path;
    this.padding = false;
  }

  onSelect(event: any) {
    if (event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.portraitPath = event.target.result;
        this.user.iconPath = this.portraitPath;
      };
    }
  }
}
