import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    let id = localStorage.getItem("uid");
    let google = localStorage.getItem("google");
    let allow = (id != null) || (google != null);

    if (!allow) {
      if (google != null) localStorage.removeItem('google');
      this.router.navigateByUrl("/login");
    }
    return (allow);
  }
  canMatch(): boolean {
    return true;
  }
}



