import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent  {

  hide:boolean=true;    
  public registerForm:FormGroup = new FormGroup({  
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', Validators.required)
 })
  public loading: boolean = false; 

  constructor(public authService: AuthService, private route:Router) {

   }

  async login(){
    return this.authService.logIn(this.registerForm.value.email, this.registerForm.value.password).then((res) => {
           // Login successful       
        let user = this.authService.getAuthServiceUser();
        let id = user._delegate.uid;
        console.log("user",id);  
        localStorage.setItem('uid',id)        
        this.route.navigateByUrl("/main");
         })
         .catch((error) => {
          console.log("fail");
         });
     }

     getCuttenUser(){
      //nur als test
      // let user = this.authService.getAuthServiceUser();
      // console.log("user",user._delegate.uid);  
      this.authService.logout();
      // let user = this.authService.getAuthServiceUser();
      // console.log("user",user._delegate.uid);
     }
   

}
