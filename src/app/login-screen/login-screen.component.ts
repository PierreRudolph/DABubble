import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {FormControl, Validators, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent {

  hide:boolean=true;    
  public registerForm:FormGroup = new FormGroup({  
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', Validators.required)
 })
  public loading: boolean = false; 

  constructor(public authService: AuthService) {

   }

  async login(){
    return this.authService.logIn(this.registerForm.value.email, this.registerForm.value.password).then((res) => {
           // Login successful       
        let user = this.authService.getAuthServiceUser();
        console.log("user",user._delegate.uid);          
           // this.route.navigateByUrl("/user");
         })
         .catch((error) => {
           // An error occurred
         });
     }

     getCuttenUser(){
      let user = this.authService.getAuthServiceUser();
      console.log("user",user._delegate.uid);   
     }
   

}
