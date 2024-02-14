import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent {
  hide: boolean = true;
  public errorMes = false;
  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })
  public loading: boolean = false;

  constructor(public authService: AuthService, public route: Router, public screen: ScreenService) {
  }

  async login() {

    this.authService.logIn(this.registerForm.value.email, this.registerForm.value.password).then((res) => {
      setTimeout(() => {
        let user = this.authService.getAuthServiceUser();
        if (user) {
          let id = user._delegate.uid;
          localStorage.setItem('uid', id);
          this.deleteLocalStorageGoogleToken();
          this.navigateToMainPage();
        }
      }, 500);
    }).catch((error) => {
      console.log("fail", error);
      this.errorMes = true;
      (document.getElementById("mail") as HTMLInputElement | null).value = "";
      (document.getElementById("pw") as HTMLInputElement | null).value = "";

      setTimeout(() => {
        this.errorMes = false
      }, 1500);
    });

  }

  async loginAsGuest() {
    let user;
    user = (await this.authService.logIn("gast@mail.com", "111111")).user

    let id = user._delegate.uid;
    localStorage.setItem('uid', id);
    this.deleteLocalStorageGoogleToken();
    this.navigateToMainPage();
  }


  /**
   * this function navigate to url "/", wich is the main page
   */
  navigateToMainPage() {
    this.route.navigateByUrl("/");
  }

  /**
   * deletes google login token, because normal login will not overwrite google token, if one is there
   */
  deleteLocalStorageGoogleToken() {
    localStorage.removeItem('google');
  }


  async logInWithGoogle() {
    this.authService.logInWithGoogle().
      then((dat) => {
        setTimeout(() => {
          let user = this.authService.getAuthServiceUser();
          let userName = user._delegate.displayName;
          localStorage.setItem('google', userName);
          this.navigateToMainPage();
        }, 500);
      }).
      catch((err) => {
        console.log("fail", err);
        this.errorMes = true;
        setTimeout(() => { this.errorMes = false }, 1500);
      });
  }
}
