import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';

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
  public portraitPath = "assets/img/person.svg"

  constructor(public authService: AuthService, private router: Router) {
    let u = authService.getAuthServiceUser();
    console.log("mein user", u);
    setTimeout(() => { this.user.name = "Laura Schröder"; }, 125);

  }

  register() {
    console.log("user ", this.user.email);
    console.log("password", this.user.password);
    this.hide=false;
    this.move=true;
    setTimeout(()=>{
      this.hide=true;
    this.move=false;
    this.authService.signUp(this.user.email, this.user.password).then(() => {
      console.log("successful register");
      this.router.navigateByUrl('/login');

    })
      .catch((error) => {
        console.log("register fail", error);
      })
    },2500);
   
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
