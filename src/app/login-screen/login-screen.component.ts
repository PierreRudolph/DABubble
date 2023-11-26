import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent {
  hide: boolean = true;
  public screenWidth = 0;
  private emailPattern = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\\u0022(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\\u0022)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"

  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })
  public loading: boolean = false;

  constructor(public authService: AuthService, public route: Router) {
    window.addEventListener("resize", this.resizeWindow);
  }

  resizeWindow() {
    this.screenWidth = window.innerWidth;
  }

  blendOutHeader() {
    return window.innerWidth < 835;
  }


  async login() {
    // return this.authService.logIn(this.registerForm.value.email, this.registerForm.value.password).then((res) => {
    // try {

    console.log(this.registerForm.controls['password'].errors?.['minlength'])

    // this.authService.logIn(this.registerForm.value.email, this.registerForm.value.password).then((res) => {
    //   // Login successful       
    //   setTimeout(() => {
    //     let user = this.authService.getAuthServiceUser();
    //     if (user) {
    //       let id = user._delegate.uid;
    //       localStorage.setItem('uid', id);
    //       localStorage.removeItem('google');
    //       this.route.navigateByUrl("/main");
    //     }
    //     else {
    //       console.log("invalid login");
    //     }
    //   }, 500);
    // }).catch((error) => {
    //   console.log("fail", error);
    // });

  }

  async loginAsGuest() {
    return this.authService.logIn("gast@mail.com", "gggggg").then((res) => {
      // Login successful   
      localStorage.removeItem('google');

      setTimeout(() => {
        let user = this.authService.getAuthServiceUser();
        let id = user._delegate.uid;
        localStorage.setItem('uid', id);
        this.route.navigateByUrl("/main");
      }, 500)
    })
      .catch((error) => {
        console.log("fail", error);
      });
  }

  async logInWithGoogle() {
    this.authService.logInWithGoogle().
      then((dat) => {
        console.log("succesfully logged in with google", dat);
        setTimeout(() => {
          let user = this.authService.getAuthServiceUser();
          let userName = user._delegate.displayName;
          localStorage.setItem('google', userName);
          // this.route.navigateByUrl("/login");
          this.route.navigateByUrl("/main");
        }, 500);
      }).
      catch((err) => { console.log("fail", err); });
  }
}
