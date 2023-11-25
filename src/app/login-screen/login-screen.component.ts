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
  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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


    this.authService.logIn(this.registerForm.value.email, this.registerForm.value.password).then((res) => {
      // Login successful       
      setTimeout(() => {
        let user = this.authService.getAuthServiceUser();
        if (user) {
          let id = user._delegate.uid;
          localStorage.setItem('uid', id);
          localStorage.removeItem('google');
          this.route.navigateByUrl("/main");
        }
        else {
          console.log("invalid login");
        }
      }, 500);
    }).catch((error) => {
      console.log("fail", error);
    });

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
