import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent {
  public registerForm: FormGroup = new FormGroup({
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required),  
  })
  changePw(){}

  getValid(){
    return  ! (this.registerForm.valid &&( this.registerForm.value.password == this.registerForm.value.passwordConfirm));
  }
}
