import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  @Output() newItemEvent = new EventEmitter<User>();
  public hide: boolean = true;
  public userInfo: string = "";
  public user: User = new User();
  private emailPattern = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\\u0022(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\\u0022)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"

  //backslash pattern hack \\s anstatt \s
  public registerForm: FormGroup = new FormGroup({
    data: new FormControl('', Validators.requiredTrue),
    name: new FormControl('', [Validators.required, Validators.pattern('([a-zA-ZäöüÄÖÜß]+\\s+){1,10}([a-zA-ZäöüÄÖÜß]+)')]),
    // email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required])
  })
  public loading: boolean = false;
  public screenWidth = 0;
  constructor() {
    window.addEventListener("resize", this.resizeWindow);
  }

  resizeWindow() {
    this.screenWidth = window.innerWidth;
  }

  /**
   * Method send the given user up to the parent compopnent.
   * @param user User that was created 
   */
  addNewItem(user: User) {
    this.newItemEvent.emit(user);
  }

  /**
   * Is executed when clicking in "weiter" in the create new account
   */
  weiter() {
    let userInfo = {
      "name": this.registerForm.value.name,
      "email": this.registerForm.value.email,
      "password": this.registerForm.value.password,
      "iconPath": "",
      "status": "",
      "uid": "",
      "idDB": "",
      "talkID": []
    };
    this.user = new User(userInfo);
    this.userInfo = JSON.stringify(userInfo);

    this.addNewItem(this.user);
  } 

}
