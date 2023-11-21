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
        let user = this.authService.getAuthServiceUser();
        console.log("authservoce user", user);
       if(user){
        let id = user._delegate.uid;
        console.log("user", id);
        localStorage.setItem('uid', id);
        localStorage.removeItem('google');
        localStorage.removeItem('googleName');
        this.route.navigateByUrl("/main");
       }
       else{
        console.log("invalid login");
       }
      }).catch((error) => {
        console.log("fail", error);
      });
    // } catch (e) { console.log("Error is",e); }
  }

  async loginAsGuest() {
    return this.authService.logIn("gast@mail.com", "gggggg").then((res) => {
      // Login successful   
      localStorage.removeItem('google');
      localStorage.removeItem('googleName');
      let user = this.authService.getAuthServiceUser();
      let id = user._delegate.uid;
      console.log("user", id);
      console.log("Logegd in as Guest");
      localStorage.setItem('uid', id);
      // this.route.navigateByUrl("/main");
      this.route.navigateByUrl("/main");
    })
      .catch((error) => {
        console.log("fail");
      });
  }

  async logInWithGoogle() {
    this.authService.logInWithGoogle().
      then((dat) => {
        console.log("succesfully logged in with google", dat);

        let user = this.authService.getAuthServiceUser();
        let userName = user._delegate.displayName;
        console.log("googleuserName", userName);

        localStorage.setItem('google', userName);
        // this.route.navigateByUrl("/login");
        this.route.navigateByUrl("/main");
      }).
      catch((err) => { });
  }

  getCuttenUser() {
    //nur als test
    let user = this.authService.getAuthServiceUser();
    // console.log("userid is",user._delegate.uid);
    // this.route.navigateByUrl("/main");
    if (user) {
      this.authService.logout();
      console.log("userid is", user._delegate.uid);
    }
  }

}
