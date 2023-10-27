import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
// import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  private user = this.authService.getAuthServiceUser();
  constructor(public authService: AuthService, private router:Router) {
     }

  canActivate(): boolean {
    let userid =this.user ? this.user._delegate.uid:'';
    let id = localStorage.getItem("uid");
    console.log("item", id);
    console.log("useritem", userid);
    let allow = id!=null && id==userid     
    console.log("navigation allowed?:", allow);
    if(!allow)
    {
     this.router.navigateByUrl("/login");
    }
    return (id!=null && id==userid);
   
    // return true;
  }
  canMatch(): boolean {
    return true;
  }
}



