import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit, OnDestroy {
  ngUnsubscribe: Subject<any> = new Subject<any>();
  mode: string = "";

  public hide: boolean = true;
  public move: boolean = false;
  actionCode: string = "";
  public registerForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

  getValid() {
    return !(this.registerForm.valid && (this.registerForm.value.password == this.registerForm.value.passwordConfirm));
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  /**
   * Process the Authentification of the reset email, by checking the sendet queryparameters
   */
  ngOnInit() {
    if (this.activatedRoute.queryParams) {//if abfrage fürs testing
      this.activatedRoute.queryParams
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(params => {
          if (!params) this.router.navigateByUrl('login');
          this.mode = params['mode'];
          this.actionCode = params['oobCode'];

          switch (params['mode']) {
            case "resetPassword": {
              this.authService.getAuth().verifyPasswordResetCode(this.actionCode).then(email => {
              }).catch(e => {
                alert(e);
                this.router.navigate(['/auth/login']);
              });
            } break
            default: {
              console.log('query parameters are missing');
              this.router.navigateByUrl('login');
            }
          }
        })
    }
  }

  /**
   *  End all subscriptions listening to ngUnsubscribe
   */
  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  /**
 * Attempt to confirm the password reset with firebase and
 * navigate user back to home.
 */
  handleResetPassword() {

    if ((this.registerForm.value.password != this.registerForm.value.passwordConfirm)) {
      alert('New Password and Confirm Password do not match');
      return;
    }
    // Save the new password.
    this.authService.getAuth().confirmPasswordReset(
      this.actionCode,
      this.registerForm.value.password
    )
      .then(resp => {
        // Password reset has been confirmed and new password updated.
        this.hide = false;
        this.move = true;
        setTimeout(() => {
          this.hide = true;
          this.move = false;
          this.router.navigateByUrl('login');
        }, 2500);

      }).catch(e => {
        // Error occurred during confirmation. The code might have
        // expired or the password is too weak.
        alert(e);
      });
  }


}
