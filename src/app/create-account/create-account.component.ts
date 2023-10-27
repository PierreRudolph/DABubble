import { Component ,Output,EventEmitter} from '@angular/core';
import { AuthService } from '../auth.service';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {

  @Output() newItemEvent = new EventEmitter<string>();
  public hide:boolean=true;  
  public userInfo:string = "";     
  public registerForm:FormGroup = new FormGroup({
    data:new FormControl('', Validators.requiredTrue),
    name:new FormControl('', Validators.required),
    email:new FormControl('', [Validators.required, Validators.email]),
    password:new FormControl('', Validators.required)
 })
  public loading: boolean = false;


  constructor(public authService: AuthService, private router:Router) {
   let u = authService.getAuthServiceUser();
   console.log("mein user",u);
   }

   addNewItem(js: string) {
    this.newItemEvent.emit(js);
  }

   weiter(){    
    let userInfo = {
    "name":this.registerForm.value.name, 
    "email":this.registerForm.value.email,
    "password":this.registerForm.value.password
     };
    this.userInfo = JSON.stringify(userInfo);
    console.log(userInfo);
    this.addNewItem(JSON.stringify(userInfo));    
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

    clickBox(){     
      console.log("return check value", this.registerForm.value.data);
    }
    

}
