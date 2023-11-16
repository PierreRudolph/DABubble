import { Component ,Output,EventEmitter} from '@angular/core';
import { AuthService } from '../auth.service';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/moduls/user.class';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  @Output() newItemEvent = new EventEmitter<User>();
  public hide:boolean=true;  
  public userInfo:string = "";    
  public user:User= new User(); 
  public registerForm:FormGroup = new FormGroup({
    data:new FormControl('', Validators.requiredTrue),
    name:new FormControl('', Validators.required),
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', Validators.required)
 })
  public loading: boolean = false;

  constructor() {  
   }

/**
 * Method send the given user up to the parent compopnent.
 * @param user User that was created 
 */
   addNewItem(user:User) {
    this.newItemEvent.emit(user);
  }

  /**
   * Is executed when clicking in "weiter" in the create new account
   */
   weiter(){    
    let userInfo = {
    "name":this.registerForm.value.name, 
    "email":this.registerForm.value.email,
    "password":this.registerForm.value.password,
    "iconPath":"",
    "status":"",
    "uid":"",
    "idDB":"",
    "talkID":[]
     };
    this.user = new User(userInfo);
    this.userInfo = JSON.stringify(userInfo);
    console.log(userInfo);
    this.addNewItem(this.user);    
   } 

    clickBox(){     
      console.log("return check value", this.registerForm.value.data);
    }
    
    }
