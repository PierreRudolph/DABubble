import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
// import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    let user = this.authService.getAuthServiceUser();
    let userid = user ? user._delegate.uid : 'no';
    let id = localStorage.getItem("uid");
    let google = localStorage.getItem("google"); 
    let allow = (id != null && id == userid) || (google != null);   
    
    if (!allow) {
      if (google != null) localStorage.removeItem('google');
      this.router.navigateByUrl("/login");
    }
    return (allow);

    // return true;
  }
  canMatch(): boolean {
    return true;
  }
}



