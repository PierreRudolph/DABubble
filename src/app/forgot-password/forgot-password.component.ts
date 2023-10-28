import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
constructor(public authService: AuthService){}
  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])    
  })

  weiter(){
    this.forgotPassword();
  }

  async forgotPassword(){
    return this.authService.forgotPassword(this.registerForm.value.email).then(()=>{
      window.alert(" Wir senden Ihnen eine E-Mail, über die Sie Ihr Passwort ändern können.");
    }).catch((err)=>{
      window.alert(err);
    });
  }

}
