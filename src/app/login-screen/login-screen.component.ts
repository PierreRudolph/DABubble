import { Component, ElementRef, ViewChild } from '@angular/core';
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
  public hide: boolean = true;
  public errorMes: boolean = false;
  public loading: boolean = false;
  private user: any;
  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })
  @ViewChild('mailInput') mailInput: ElementRef;
  @ViewChild('passwordInput') passwordInput: ElementRef;

  constructor(public authService: AuthService, public route: Router, public screen: ScreenService) { }


  async login() {
    await this.authService.logIn(this.registerForm.value.email, this.registerForm.value.password).then((result) => {
      this.setLoggedInUser(result);
      this.navigateToMainPage();
    }).catch((error) => {
      this.showErrorMessage(error);
      this.clearInputs();
    });
  }


  async loginAsGuest() {
    await this.authService.logIn("gast@mail.com", "111111").then((result) => {
      this.setLoggedInUser(result);
      this.navigateToMainPage();
    }).
      catch((err) => {
        this.showErrorMessage(err)
      });

  }


  async logInWithGoogle() {
    await this.authService.logInWithGoogle().then((result) => {
      this.setLoggedInUser(result);
      this.navigateToMainPage();
    }).
      catch((err) => {
        this.showErrorMessage(err)
      });
  }


  setLoggedInUser(result: { user: any; }) {
    this.user = result.user
    localStorage.setItem('uid', this.user.uid);
  }


  showErrorMessage(error: any) {
    console.log("fail", error);
    this.errorMes = true;
    setTimeout(() => {
      this.errorMes = false
    }, 1500);
  }


  clearInputs() {
    this.mailInput.nativeElement.value = '';
    this.passwordInput.nativeElement.value = '';
  }


  /**
  * this function navigate to url "/", wich is the main page
  */
  navigateToMainPage() {
    this.route.navigateByUrl("/");
  }
}