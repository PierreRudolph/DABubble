import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  constructor(public authService: AuthService) { }

  public hide: boolean = true;
  public move: boolean = false;
  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  /**
   * Executed when click on "weiter"
   */
  weiter() {
    this.hide = false;
    this.move = true;
    setTimeout(() => {
      this.hide = true;
      this.move = false;
      this.forgotPassword();
    }, 2500);
  }

  /**
   * 
   * @returns Send the forget request to the firebase authservice
   */
  async forgotPassword() {
    return this.authService.forgotPassword(this.registerForm.value.email).then(() => {
    }).catch((err) => {
      window.alert(err);
    });
  }

}
