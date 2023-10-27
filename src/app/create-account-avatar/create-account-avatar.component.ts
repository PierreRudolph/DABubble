import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account-avatar',
  templateUrl: './create-account-avatar.component.html',
  styleUrls: ['./create-account-avatar.component.scss']
})
export class CreateAccountAvatarComponent {

  @Input() name: string = "";
  @Input() user: any;
  
  public padding: boolean = true;
  public portraitPath = "assets/img/person.svg"

  constructor(public authService: AuthService, private router: Router) {
    let u = authService.getAuthServiceUser();
    console.log("mein user", u);
  }

  register() {
    console.log("user ", this.user.email);
    console.log("password", this.user.password);
    this.authService.signUp(this.user.email, this.user.password).then(() => {
      console.log("successful register");
      this.router.navigateByUrl('/login');

    })
      .catch((error) => {
        console.log("register fail", error);
      })
  }

  setPortraitPath(path: string) {
    this.portraitPath = path;
    this.padding = false;
  }

  onSelect(event: any) {
    console.log("event", event);
    if (event.taget.files[0]) {
      
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
      this.portraitPath = event.target.result;
      };
    }
  }
}
