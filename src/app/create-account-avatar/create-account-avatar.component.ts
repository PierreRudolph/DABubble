import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';
import { Firestore } from '@angular/fire/firestore';
import { ChatHepler } from 'src/moduls/chatHelper.class';

@Component({
  selector: 'app-create-account-avatar',
  templateUrl: './create-account-avatar.component.html',
  styleUrls: ['./create-account-avatar.component.scss']
})
export class CreateAccountAvatarComponent {
  @Input() name: string = "";
  @Input() user: User = new User();
  @Output() emailExistEvent = new EventEmitter();
  public padding: boolean = true;
  public hide: boolean = true;
  public correct: boolean = true;
  public move: boolean = false;
  public wait: boolean = false;
  public selectAvatar: boolean = false;
  public portraitPath: string = "assets/img/person.svg";
  public firestore: Firestore = inject(Firestore);
  public idDoc: string = "";
  public chathelper: ChatHepler = new ChatHepler();

  constructor(public authService: AuthService, private router: Router) { }


  /**
   * Sign up a new user and saves the authentication uid in the userinformations
   */
  register() {
    if (!this.selectAvatar) {
      this.user.iconPath = "assets/img/personStandard.png";
    }
    this.wait = true;
    this.signUpUser();
  }


  signUpUser() {
    this.authService.signUp(this.user.email, this.user.password).then((res) => {
      this.hide = false;
      this.move = true;
      this.user.password = "";
      this.user.uid = res.user.uid;
      this.chathelper.addUser(this.user.toJSON());
      this.navigatePage();
    })
      .catch((error) => {
        this.wait = false;
        console.log("error", error);
        this.correct = false;
        this.move = true;
        this.emitGoBack()
      })
  }


  emitGoBack() {
    setTimeout(() => {
      this.emailExistEvent.emit(true);
    }, 2000);
  }


  /** 
   * Navigates to the login Page.
  */
  navigatePage() {
    setTimeout(() => {
      this.hide = true;
      this.move = false;
      this.wait = false;
      this.correct = true;
      this.router.navigateByUrl('/login');
    }, 2500);
  }


  /**
   * Sets the selected iconpath.
   * @param path  Iconpath for the user
   */
  setPortraitPath(path: string) {
    this.selectAvatar = true;
    this.user.iconPath = path;
    this.portraitPath = path;
    this.padding = false;
  }


  /**
   * Saves the uploaded portrait as base64 code in the data. 
   * @param event Uploaded file
   */
  onSelect(event: any) {
    if (event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.portraitPath = event.target.result;
        this.user.iconPath = this.portraitPath;
        this.selectAvatar = true;
      };
    }
  }
}
