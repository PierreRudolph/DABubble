import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  hide:boolean=true;    
  public registerForm:FormGroup = new FormGroup({
    name:new FormControl('', Validators.required),
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', Validators.required)
 })
  public loading: boolean = false;


  constructor(public authService: AuthService, private router:Router) {
   let u = authService.getAuthServiceUser();
   console.log("mein user",u);
   }

  register() {
    this.authService.signUp(this.registerForm.value.email,   this.registerForm.value.password).then(() => {  
      console.log("successful register"); 
      this.router.navigateByUrl('/login');

        })
        .catch((error) => {
          console.log("register fail",error);
        })  
    }
    

}
